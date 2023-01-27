import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import Container from 'typedi';
import { CommunityController } from '../controllers/communityController';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  const ctrl: CommunityController = Container.get(CommunityController);

  app.use('/community', route);

  route.post('/create', ctrl.createCommunity);

  route.post('/subscribe/:communityId', middlewares.isAuth, ctrl.subscribeToCommunity);

  route.get('/my', middlewares.isAuth, ctrl.getAllCommunitiesForUser);
};
