import { createLogger, format, transports } from 'winston';
import winstonDaily, {
  DailyRotateFileTransportOptions,
} from 'winston-daily-rotate-file';
import path from 'node:path';
import { cwd } from 'node:process';

const { combine, timestamp, colorize, printf, prettyPrint } = format;
const logDir = path.join(cwd(), 'logs');
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const ignorePrivate = format((info) => (info.private ? false : info));

/**
 * Custom logging format
 */
const customFormat = printf(({ level, message, timestamp, ...meta }) => {
  let result = `[${level}] ${timestamp}: ${message}`;
  if (Object.keys(meta).length) {
    result += ` ${JSON.stringify(meta)}`;
  }
  return result;
});

/**
 * Transform log level to uppercase
 */
const uppercaseLevel = format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});

type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

/**
 * Generate configuration for daily rotating files based on level and filename
 */
const dailyRotateFileConfig = (
  level: LogLevel,
  filename: string,
): DailyRotateFileTransportOptions => ({
  level,
  datePattern: 'YYYY-MM-DD',
  dirname: logDir,
  filename: `%DATE%${filename}.log`,
  maxFiles: '7d', // Keep logs for 7 days
  maxSize: '5m', // Max size of each log file
  zippedArchive: true,
});

export const logger = createLogger({
  format: combine(
    ignorePrivate(),
    uppercaseLevel(),
    timestamp({ format: DATE_FORMAT }),
    customFormat,
  ),
  transports: [
    new winstonDaily(dailyRotateFileConfig('info', '')),
    new winstonDaily({
      ...dailyRotateFileConfig('error', '.error'),
      dirname: path.join(logDir, 'error'), // Override dirname for error logs
    }),
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),
  ],
  exceptionHandlers: [
    new winstonDaily(dailyRotateFileConfig('error', '.exception')),
  ],
});
