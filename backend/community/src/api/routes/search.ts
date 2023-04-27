import { Router } from 'express';
import Container from 'typedi';
import { SearchController } from '../controllers/searchController';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  const ctrl: SearchController = Container.get(SearchController);

  app.use('/search', route);

  route.get('/', middlewares.isAuth, ctrl.searchTerm);
};
