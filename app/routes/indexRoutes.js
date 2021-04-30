
import { Router } from "express";
import userRoute from './user.routes';
import audioRoute from './audio.routes';
import lobbyRoute from './lobby.route';
import groupRoute from './group.route';

const routes = Router();
routes.use('/user', userRoute) 
routes.use(audioRoute);
routes.use('/lobby', lobbyRoute);
routes.use('/group', groupRoute);

export default routes;

