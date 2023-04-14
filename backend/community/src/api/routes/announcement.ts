import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import Container from 'typedi';
import { AnnouncementController } from '../controllers/announcementController';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  const ctrl: AnnouncementController = Container.get(AnnouncementController);

  app.use('/announcement', route);

  route.post('/create', middlewares.isOfficerAuth, ctrl.createAnnouncement);
};
