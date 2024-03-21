const { consume } = require("./services/kafka.service");
const { logger } = require("./services/logger.service");

consume()
  .then(() => {
    logger.info("produced successfully");
  })
  .catch((err) => logger.error(err));
