import { Router } from 'express';
import community from './routes/community';
import post from './routes/post';
import tag from './routes/tag';
import upload from './routes/upload';
import auth from './routes/auth';
import search from './routes/search';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  community(app);
  post(app);
  upload(app);
  tag(app);
  auth(app);
  search(app);
  return app;
};
