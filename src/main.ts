import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: false,
    });
    await app.listen(process.env.Port);
    console.log(`Your NestJS server is running on port ${process.env.Port}`);
  } catch (error) {
    console.error('Failed to start Nest application:', error);
  }
}
bootstrap();
