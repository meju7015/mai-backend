import { registerAs } from '@nestjs/config';

export default registerAs('pinecone', () => ({
  index: process.env.PINECONE_INDEX_NAME,
  project: process.env.PINECONE_PROJECT,
  environment: process.env.PINECONE_ENVIRONMENT,
  apiKey: process.env.PINECONE_API_KEY,
}));
