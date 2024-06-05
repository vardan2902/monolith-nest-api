import * as winston from 'winston';
import { AnsiColors } from './enum';
import { colorize } from 'src/config/log-utils';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.align(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `[${colorize(timestamp, AnsiColors.FgCyan)}] [${
            context || 'NestJS'
          }] ${level}: ${message}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'var/logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'var/logs/combined.log' }),
  ],
};
