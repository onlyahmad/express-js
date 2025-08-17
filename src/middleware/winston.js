import winston from "winston";
import "winston-daily-rotate-file";

const transport = new winston.transports.DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "error", // perbaikan typo
  handleExceptions: true,
});

const logger = winston.createLogger({
  level: "silly",
  format: winston.format.combine(
    winston.format.label({ label: "[LOGGER]" }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss A" }),
    winston.format.printf(
      (info) =>
        ` ${info.label} ${info.timestamp}: ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: "silly",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) =>
            ` ${info.label} ${info.timestamp}: ${info.level}: ${info.message}`
        )
      ),
    }),
    transport,
  ],
  exitOnError: false,
});

export default logger;
