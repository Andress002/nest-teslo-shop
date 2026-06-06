import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { RequestAuth } from '../interfaces/request.interface';

@Injectable()
//se agrega <T, T> por que data entra como T y sale como T, si se quisiera transformar a otro tipo se pondria <T, R> por ejemplo
export class LoggingInterceptor<T> implements NestInterceptor<T, T> {
  private readonly logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T> | Promise<Observable<T>> {
    const request = context
      .switchToHttp()
      .getRequest<Omit<RequestAuth, 'user'>>();
    const { method, url } = request;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(`${method} ${url} ${delay}`);
      }),
    );
  }
}
