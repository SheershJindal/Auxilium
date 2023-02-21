import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';
import cache from './cache';
import Container from 'typedi';
import { TagRepository } from '@/repositories/tagRepository';
import JobFactory from '@/jobs';
import schedule from 'node-schedule';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  await dependencyInjectorLoader();
  Logger.info('✌️ Dependency Injector loaded');

  await cache.connect();
  Logger.info('✌️ Redis Connected');

  await JobFactory();

  // const prev = JSON.parse(await cache.get('tags')) || [];
  // console.log(prev);

  // const tag = Container.get(TagRepository);
  // const records = await tag.getAllTags();
  // console.log(records);
  // const repo = new TagRepository
  // const record = await repo.createTag('');
  // console.log(record);
  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
