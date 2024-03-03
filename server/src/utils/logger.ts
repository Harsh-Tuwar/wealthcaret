import winston from 'winston';

const logFormat = winston.format.printf(function (info) {
  if (process.env.VERCEL_ENV !== 'production') {
    return `${JSON.stringify(info)}`;
  } else {
    return `${JSON.stringify(info, null, 2)}\n`;
  }
});

const format = winston.format.combine(
  logFormat,
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms Z' }),
);

const transports = [
  new winston.transports.Console(),
];

export const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { timestamp: new Date().toUTCString() },
  format,
  transports,
});
