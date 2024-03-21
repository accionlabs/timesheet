const { Kafka } = require("kafkajs");
const { logger } = require("./logger.service");
const clientId = "timesheet";
const brokers = ["broker:29092"];
const topic = "events";
const kafka = new Kafka({ clientId, brokers });
const producer = kafka.producer();

const produce = async (data) => {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: data,
    });
    logger.info(
      `Producer: messages sent successfully to Kafka Messaging Broker`
    );
  } catch (error) {
    logger.error(`Producer: ${error}`);
  } finally {
    await producer.disconnect();
  }
};

module.exports = {
  produce,
};
