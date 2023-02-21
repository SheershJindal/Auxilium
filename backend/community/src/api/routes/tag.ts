import { Router } from 'express';
import Container from 'typedi';
import { TagController } from '../controllers/tagController';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  const ctrl: TagController = Container.get(TagController);

  app.use('/tags', route);

  route.get('/', middlewares.isAuth, ctrl.getAllTags);

  route.post('/', middlewares.isOfficerAuth, ctrl.createTag);
};
