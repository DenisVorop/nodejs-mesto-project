import { format, transports } from "winston";
import * as expressWinston from "express-winston";

const requestLogger = expressWinston.logger({
  transports: [new transports.File({ filename: "logs/request.log" })],
  format: format.combine(format.timestamp(), format.json()),
  meta: true, // добавляет метаданные, такие как путь, метод, статус и т. д.
  expressFormat: true, // позволяет логировать информацию, специфичную для express
  colorize: false,
  msg: "HTTP {{req.method}} {{req.url}}",
});

const errorLogger = expressWinston.errorLogger({
  transports: [new transports.File({ filename: "logs/error.log" })],
  format: format.combine(format.timestamp(), format.json()),
});

export { requestLogger, errorLogger };
