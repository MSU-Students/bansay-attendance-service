import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
<<<<<<< HEAD
        port: parseInt(process.env.PORT!, 10) || 3003,
=======
        port: 3003,
>>>>>>> origin/feat/attendance-class-crud
      }
    },
  );
  await app.listen();
}
bootstrap();
