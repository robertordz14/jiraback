const { createLogger, format, transports } = require("winston");

let date = new Date();
let fecha =
  String(date.getDate()).padStart(2, "0") +
  "-" +
  String(date.getMonth() + 1).padStart(2, "0") +
  "-" +
  date.getFullYear();

let cantidad = String(date.getMonth() + 1).padStart(2, "0")

module.exports = createLogger({
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(
      (info) => `[${info.timestamp} ${info.level} ${info.message}] `
    )
  ),
  transports: [
    new transports.File({
      maxsize: 5120000,
      maxFiles: cantidad,
      filename: `${__dirname}/logSeguridad_${fecha}.txt`,
    }),
  ],
});