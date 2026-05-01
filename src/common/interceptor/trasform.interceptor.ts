import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MESSAGE_KEY } from 'src/auth/decorators/message.decorator';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const message = this.reflector.get<string>(MESSAGE_KEY, context.getHandler()) || 'Operacion realizada con exito' 
    return next.handle().pipe(
      map(data => ({
        message: message,
        data: data,
      })),
    );
  }
}
