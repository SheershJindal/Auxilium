import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';
import cache from './cache';
import JobFactory from '@/jobs';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  await cache;
  Logger.info('✌️ Redis Connected');

  await dependencyInjectorLoader();
  Logger.info('✌️ Dependency Injector loaded');

  await JobFactory();

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
