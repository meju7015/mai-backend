import { HttpException, Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { Assets } from './entity/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PDFLoader, TextLoader } from 'langchain/document_loaders';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores';
import { PineconeNamespaces } from './entity/pinecone-namespace.entity';
import { Document } from 'langchain/docstore';

import { html2text } from '../../utils/functions';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import client from '../../utils/axios-client';

@Injectable()
export class AssetService {
  private s3Client: S3Client;

  constructor(
    @InjectRepository(Assets)
    private assetRepository: Repository<Assets>,
    @InjectRepository(PineconeNamespaces)
    private pineconeNamespaceRepository: Repository<PineconeNamespaces>,
    private readonly config: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.config.get('aws.region'),
      credentials: {
        accessKeyId: this.config.get('aws.accessKeyId'),
        secretAccessKey: this.config.get('aws.secretAccessKey'),
      },
    });
  }

  async createText2Doc(
    rawDocs: Document[],
    namespace: { filename: string; fileSize: number },
  ) {
    const uuid = v4();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    console.log('split docs :: ', docs);
    console.log('creating vector store ...');

    const pinecone = await this.initPinecone();
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(this.config.get('pinecone.index'));

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: uuid,
      textKey: 'text',
    });

    const pineconeNamespace = new PineconeNamespaces();
    pineconeNamespace.filename = namespace.filename;
    pineconeNamespace.fileSize = namespace.fileSize;
    pineconeNamespace.namespace = uuid;

    console.log('ingestion complete');

    return await this.pineconeNamespaceRepository.save(pineconeNamespace);
  }

  getBucketFullPath(uuid: string) {
    return `${this.config.get('aws.s3.bucket')}/${this.config.get(
      'aws.s3.prefix',
    )}/${uuid}/`;
  }

  async createAsset(asset: Express.Multer.File): Promise<Assets> {
    const uuid = v4();
    const bucketFullPath = this.getBucketFullPath(uuid);

    const putObjectCommand = new PutObjectCommand({
      Key: bucketFullPath,
      Body: asset.buffer,
      Bucket: this.config.get('aws.s3.bucket'),
      ContentType: asset.mimetype,
      ContentDisposition: 'attachment',
    });

    const response = await this.s3Client.send(putObjectCommand);
    const { $metadata } = response;

    if (!this.checkCreateAsset(response)) {
      throw new HttpException(
        'failed to create file by s3',
        $metadata.httpStatusCode,
      );
    }

    try {
      const assets = new Assets();
      assets.uuid = uuid;
      assets.name = asset.originalname;
      assets.contentType = asset.mimetype;
      assets.createdAt = new Date();

      return await this.assetRepository.save(assets);
    } catch (e) {
      throw new HttpException('failed to save file', 500);
    }
  }

  checkCreateAsset(response: PutObjectCommandOutput) {
    return response?.$metadata.httpStatusCode === 200;
  }

  async createPdf(asset: Express.Multer.File) {
    const pdf = new PDFLoader(new Blob([asset.buffer]));

    const rawDocs = await pdf.load();

    return await this.createText2Doc(rawDocs, {
      filename: asset.originalname ?? '-',
      fileSize: asset.size,
    });
  }

  async initPinecone() {
    try {
      const pinecone = new PineconeClient();

      await pinecone.init({
        environment: this.config.get('pinecone.environment'),
        apiKey: this.config.get('pinecone.apiKey'),
      });

      return pinecone;
    } catch (error) {
      console.error('pinecone init error :: ', error);
    }
  }

  async createText(asset: Express.Multer.File) {
    const text = new TextLoader(new Blob([asset.buffer]));

    const rawDocs = await text.load();

    return await this.createText2Doc(rawDocs, {
      filename: asset.originalname ?? '-',
      fileSize: asset.size,
    });
  }

  async createPlainText(plainText: string) {
    const text = new TextLoader(new Blob([plainText]));

    const rawDocs = await text.load();

    return await this.createText2Doc(rawDocs, {
      filename: 'plain-text',
      fileSize: plainText.length,
    });
  }

  async axiosGetUrlToText(urls: string[]) {
    const htmlTexts = [];

    for (const url of urls) {
      const response = await axios.get(url);
      htmlTexts.push({
        url,
        text: html2text(response.data),
      });
    }

    return htmlTexts;
  }

  async createWeb(url: string) {
    const urls = await this.getSitemap(url);
    const htmlTexts = await this.axiosGetUrlToText(urls);
    const text = new TextLoader(
      new Blob([htmlTexts.map((htmlText) => htmlText.text).join('\n')]),
    );

    const rawDocs = await text.load();

    return await this.createText2Doc(rawDocs, {
      filename: url ?? 'web',
      fileSize: 0,
    });
  }

  async getSitemap(url: string): Promise<string[]> {
    const parser = new XMLParser();
    const pattern = /(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi;
    const matched = url.match(pattern);

    if (!matched?.[0]) {
      throw new HttpException('invalid url', 400);
    }

    let sitemapUrls = [url];
    const response = await client.get(`${matched[0]}/sitemap.xml`);

    if (response.status === 200) {
      const tmpSitemap = parser.parse(response.data).urlset?.url;

      if (tmpSitemap) {
        sitemapUrls = tmpSitemap.map((_url) => _url.loc);
      }
    }

    return sitemapUrls;
  }
}
