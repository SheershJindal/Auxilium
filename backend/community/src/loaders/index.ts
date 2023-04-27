import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';
import { initializeCache, reinitializeTagsCache } from './cache';
import { connect as kafkaLoader } from './kafka';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  initializeCache();
  Logger.info('✌️ Cache initialized');

  await kafkaLoader();
  Logger.info('✌️ Kafka producer connected!');

  await dependencyInjectorLoader();
  Logger.info('✌️ Dependency Injector loaded');

  await reinitializeTagsCache();
  Logger.info('✌️ Reinitialized Tags in Cache');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
