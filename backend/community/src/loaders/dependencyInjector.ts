import { Container } from 'typedi';
import LoggerInstance from './logger';
import { rateLimitCache as RateLimitCacheInstance, tagsCache as TagsCacheInstance } from './cache';
import MailerInstance from './mailer';

export default () => {
  try {
    Container.set('logger', LoggerInstance);
    Container.set('tagsCache', TagsCacheInstance);
    Container.set('rateLimitCache', RateLimitCacheInstance);
    Container.set('emailClient', MailerInstance);
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
