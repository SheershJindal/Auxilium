import config from '@/config';
import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
  logLevel: logLevel.ERROR,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: config.kafka.consumerGroupId });

export const connect = async () => {
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({ topics: [{ topic: config.kafka.search_index_topic }] });
  await admin.disconnect();
  await producer.connect();
};

export default kafka;
