const { Kafka } = require("kafkajs");
const { logger } = require("./logger.service");
const { setUpPushNotifications } = require("./push-notifications.service");
const { setUpEmails } = require("./email.service");

const clientId = "timesheet";
const brokers = ["broker:29092"];
const topic = "events";
const kafka = new Kafka({ clientId, brokers });
const consumer = kafka.consumer({ groupId: clientId });
const consume = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachBatch: async ({ batch }) => {
      const users = batch.messages.map((message) =>
        JSON.parse(message.value.toString())
      );
      setUpPushNotifications(users);
      setUpEmails(users);
    },
  });
};

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.forEach((type) => {
  process.on(type, async (e) => {
    try {
      logger.log(`process.on ${type}`);
      logger.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});

module.exports = {
  consume,
};
