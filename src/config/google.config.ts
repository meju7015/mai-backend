import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirect: process.env.GOOGLE_REDIRECT,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
}));
