
import { Router } from "express";
import userRoute from './user.routes';
import audioRoute from './audio.routes';
import lobbyRoute from './lobby.route';
import groupRoute from './group.route';

const routes = Router();
routes.use('/data', dataRoutes) 
routes.use(audioRoute);
routes.use(lobbyRoute);
routes.use(groupRoute);

export default routes;

