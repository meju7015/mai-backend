import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  region: 'ap-northeast-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3: {
    bucket: 'mai-storage',
    prefix: 'assets',
  },
}));
