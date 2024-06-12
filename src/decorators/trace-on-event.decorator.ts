import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { colorize } from 'src/config/log-utils';
import { AnsiColors } from 'src/config/enum';
import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';

export function TraceOnEvent(event: string, options?: OnEventOptions) {
  const logger = new Logger('EventEmitter');
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      logger.log(
        `Listening event...\nevent: ${colorize(
          event,
          AnsiColors.FgMagenta,
        )}\ndata: ${colorize(
          JSON.stringify(args, null, 2),
          AnsiColors.FgYellow,
        )}`,
      );
      return originalMethod.apply(this, args);
    };

    OnEvent(event, options)(target, propertyKey, descriptor);
  };
}
