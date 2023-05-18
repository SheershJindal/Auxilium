import { Router } from "express";
import { DiscoverController } from "../controllers/discoverController";
import Container from "typedi";
import middlewares from "../middlewares";

const route = Router();
export default (app:Router) =>{
    const ctrl:DiscoverController = Container.get(DiscoverController);
    
    app.use('/discover', route);

    route.get('/', middlewares.isAuth, ctrl.getCustomisedDiscover);
}