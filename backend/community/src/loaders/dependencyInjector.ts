import { Container } from 'typedi';
import LoggerInstance from './logger';
import RedisInstance from './cache';
import MailerInstance from './mailer';

export default () => {
  try {
    Container.set('logger', LoggerInstance);
    Container.set('cache', RedisInstance);
    Container.set('emailClient', MailerInstance);
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
