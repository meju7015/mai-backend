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

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(PineconeNamespaces)
    private readonly pineconeRepository: Repository<PineconeNamespaces>,
    @InjectRepository(ChatHistory)
    private readonly chatHistoryRepository: Repository<ChatHistory>,
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

    const chain = this.makeChain(vectorStore, {
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

    const chain = this.makeChain(vectorStore, {
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

  private makeChain(vectorStore, openAiOptions) {
    const model = new OpenAI(openAiOptions);

    const CONDENSE_PROMPT = `다음 대화와 후속 질문이 주어지면 다음 질문을 독립혈 질문으로 바꾼다.
채팅 기록:
{chat_history}
다음 질문: {question}
독립형 질문:`;

    const QA_PROMPT = `당신은 AI 챗봇이다. 친숙한 인간적인 말투로, 상담원 처럼 행동해줘, 마지막 질문에 답하라

{context}

질문: {question}
언어: 한국어
답은 마크다운형식으로 만든다`;

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
