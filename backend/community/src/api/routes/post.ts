import { Router } from 'express';
import Container from 'typedi';
import { PostController } from '../controllers/postController';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  const ctrl: PostController = Container.get(PostController);

  app.use('/post', route);

  route.post('/:communityId', middlewares.isAuth, ctrl.createPost);

  route.post('/:postId/comment', middlewares.isAuth, ctrl.createComment);
};
