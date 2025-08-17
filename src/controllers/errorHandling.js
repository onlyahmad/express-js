import logger from "../middleware/winston.js";
import { success, error } from "../utils/response.js";

const errorHandling = (err, req, res, next) => {
  // ambil kode error atau default 500
  const statusCode = err.statusCode || 500;

  // ambil pesan setelah tanda " - " kalau ada
  const parsedMessage = err.message.includes(" - ")
    ? err.message.split(" - ")[1]
    : err.message;

  // log detail error (stack trace kalau ada)
  logger.error(err.stack || err.message);

  res.status(statusCode).json(error(parsedMessage, null, statusCode));
};

export default errorHandling;
