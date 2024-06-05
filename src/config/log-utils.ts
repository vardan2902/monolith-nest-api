import { AnsiColors } from 'src/config/enum';

export function colorize(text: string, color: AnsiColors): string {
  return `${color}${text}${AnsiColors.Reset}`;
}
