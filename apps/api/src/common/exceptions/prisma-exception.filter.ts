import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception.code === "P2025"
        ? HttpStatus.NOT_FOUND
        : exception.code === "P2002"
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST;

    this.logger.error(`Prisma error ${exception.code}: ${exception.message}`);

    response.status(status).json({
      message: "Database operation failed",
      code: exception.code,
      meta: exception.meta
    });
  }
}
