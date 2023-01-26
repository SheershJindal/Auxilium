import { Router } from 'express';
import community from './routes/community';
import post from './routes/post';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  community(app);
  post(app);
  return app;
};
