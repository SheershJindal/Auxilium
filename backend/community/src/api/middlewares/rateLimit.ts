import { IRateLimit } from '@/interfaces/IRateLimit';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';
import Container from 'typedi';
import { rateLimitCache as RateLimitCacheInstance } from '@/loaders/cache';
import { getClientIp } from './rateLimitUtil';

const rateLimit = ({ secondsWindow = 60, allowedHits = 10 }: IRateLimit) => {
  const rateLimitCache: typeof RateLimitCacheInstance = Container.get('rateLimitCache');

  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIp(req);
    const pathUrl = `${req.method} - ${req.baseUrl}${req.path}`;
    const key = `${pathUrl}${ip}`;

    let requests = (rateLimitCache.get(key) as number) || 0;

    console.log(`${key}`, requests);

    let ttl: number;

    if (requests === 0) {
      rateLimitCache.set(key, requests + 1, secondsWindow);
      ttl = secondsWindow;
    } else {
      ttl = (rateLimitCache.getTtl(key) - new Date().getTime()) / 1000;
      rateLimitCache.set(key, requests + 1, ttl);
    }

    if (requests > allowedHits) {
      ttl = Math.floor(ttl)
      const logger: Logger = Container.get('logger');
      logger.warn(`Rate limiting the ip ${ip} for ${pathUrl}`);
      res.header('Retry-After', `${ttl}`);
      return next({ status: 429, message: `You have been rate limited, please try again in ${ttl} seconds.` });
    }
    return next();
  };
};

export default rateLimit;
