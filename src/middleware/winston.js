import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, label, printf, colorize } = winston.format;

// format umum
const logFormat = printf(
  (info) => ` ${info.label} ${info.timestamp}: ${info.level}: ${info.message}`
);

// transport untuk error log
const errorTransport = new winston.transports.DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  level: "error",
  handleExceptions: true,
});

// transport untuk semua log (info, warn, dll)
const allTransport = new winston.transports.DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
  handleExceptions: true,
});

const logger = winston.createLogger({
  level: "silly", // global level (silly > debug > verbose > info > warn > error)
  format: combine(
    label({ label: "[LOGGER]" }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss A" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      format: combine(
        colorize({ all: true }),
        label({ label: "[LOGGER]" }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss A" }),
        logFormat
      ),
    }),
    allTransport,
    errorTransport,
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
  exitOnError: false,
});

export default logger;
