import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { PrismaExceptionFilter } from "./common/exceptions/prisma-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const reflector = app.get(Reflector);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(reflector));

  const swaggerConfig = new DocumentBuilder()
    .setTitle("KaikoPOS API")
    .setDescription("Operational MVP API for restaurant and cafe management")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);
  await app.listen(port);

  Logger.log(`API listening on http://localhost:${port}/api`, "Bootstrap");
  Logger.log(`Swagger docs available at http://localhost:${port}/api/docs`, "Bootstrap");
}

bootstrap();
