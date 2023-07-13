import { Injectable } from '@nestjs/common';
import { CreateChatRequestDto } from './dto/create-chat-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PineconeNamespaces } from '../asset/entity/pinecone-namespace.entity';
import { Repository } from 'typeorm';
import { AssetService } from '../asset/asset.service';
import { ConfigService } from '@nestjs/config';
import { PineconeStore } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { OpenAI } from 'langchain';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { SseService } from '../../modules/sse/sse.service';
import { ChatHistory } from './entity/chat-history.entity';
import { Prompt } from './entity/prompt.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(PineconeNamespaces)
    private readonly pineconeRepository: Repository<PineconeNamespaces>,
    @InjectRepository(ChatHistory)
    private readonly chatHistoryRepository: Repository<ChatHistory>,
    @InjectRepository(Prompt)
    private readonly promptRepository: Repository<Prompt>,

    private readonly assetService: AssetService,
    private readonly config: ConfigService,
    private readonly sseService: SseService<string>,
  ) {}

  async createChat(createChatRequestDto: CreateChatRequestDto) {
    const { namespace, prompt, histories } = createChatRequestDto;

    const pinecone = await this.assetService.initPinecone();
    const index = pinecone.Index(this.config.get('pinecone.index'));
    const pineconeNamespace = await this.pineconeRepository.findOne({
      where: { namespace },
    });

    const sanitizedQuestion = prompt.trim().replaceAll('\n', ' ');
    const chatHistory = new ChatHistory();

    chatHistory.prompt = sanitizedQuestion;

    console.log('vectorStore init...');

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: namespace,
      },
    );

    console.log('chain init...');

    const chain = await this.makeChain(vectorStore, {
      temperature: 1,
      modelName: 'gpt-3.5-turbo-16k',
      streaming: true,
    });

    console.log('general request...');

    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: histories || [],
    });

    chatHistory.answer = response.text;
    chatHistory.namespace = pineconeNamespace;
    await this.chatHistoryRepository.save(chatHistory);

    return response;
  }

  async createChatStream(
    createChatRequestDto: CreateChatRequestDto,
  ): Promise<SseService<string>> {
    const { namespace, prompt, histories } = createChatRequestDto;

    const pinecone = await this.assetService.initPinecone();
    const index = pinecone.Index(this.config.get('pinecone.index'));

    const sanitizedQuestion = prompt.trim().replaceAll('\n', ' ');

    console.log('vectorStore init...');

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: namespace,
      },
    );

    console.log('chain init...');

    const chain = await this.makeChain(vectorStore, {
      temperature: 1,
      modelName: 'gpt-3.5-turbo-16k',
      streaming: true,
    });

    console.log('general request...');

    chain.call(
      {
        question: sanitizedQuestion,
        chat_history: histories || [],
      },
      [
        {
          handleLLMNewToken: (token) => this.sseService.addEvent(token),
        },
      ],
    );

    return this.sseService;
  }

  private async makeChain(vectorStore, openAiOptions) {
    const model = new OpenAI(openAiOptions);

    const prompts = await this.promptRepository.find();

    console.log(prompts);

    const CONDENSE_PROMPT = prompts.find((p) => p.id === 1).prompt;
    const QA_PROMPT = prompts.find((p) => p.id === 2).prompt;

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        qaTemplate: QA_PROMPT,
        questionGeneratorTemplate: CONDENSE_PROMPT,
        returnSourceDocuments: true,
      },
    );

    return chain;
  }
}
