import { Container } from 'typedi';
import LoggerInstance from './logger';
import RedisInstance from './cache';

export default () => {
  try {
    Container.set('logger', LoggerInstance);
    Container.set('cache', RedisInstance);
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
