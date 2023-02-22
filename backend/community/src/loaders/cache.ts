import config from '@/config';
import Logger from './logger';
import Redis from 'ioredis';

const redis = new Redis({ host: config.cache.host, port: config.cache.port });
redis.on('error', err => Logger.error('🔥 Error connecting to redis %o', err));

export default redis;
