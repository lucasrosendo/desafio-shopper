import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

dotenv.config({ path: '../.env' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors(corsOptions));
  const port = process.env.BACKEND_PORT || 4000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
