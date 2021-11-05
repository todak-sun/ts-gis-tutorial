import {createLogger, format, transports} from 'winston';

interface LoggerFormat {
  level: string;
  message: string;
  [key: string]: any;
}

const logger = createLogger({
  level: 'debug',
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.label({label: 'aisApiDataCollector'}),
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
        format.colorize(),
        format.printf((info: LoggerFormat) => `[${info.timestamp}][${info.level}][${info.label}] - ${info.message}`)
      ),
    }),
  ],
});

export default logger;
