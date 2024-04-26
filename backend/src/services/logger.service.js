const winston = require("winston");
const path = require("path");

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "timesheets" },
  transports: [
    //
    // - Write to all logs with level `info` and below to `timesheets-combined.log`.
    // - Write all logs error (and below) to `timesheets-error.log`.
    //
    new winston.transports.File({
      filename: path.join(
        __dirname,
        "..",
        "..",
        "logs",
        "timesheets-error.log"
      ),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(
        __dirname,
        "..",
        "..",
        "logs",
        "timesheets-combined.log"
      ),
    }),
  ],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = {
  logger,
};
