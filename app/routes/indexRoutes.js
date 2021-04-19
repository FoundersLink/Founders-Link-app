
import { Router } from "express";
import userRoute from './user.routes';
import audioRoute from './audio.routes';

const routes = Router();
routes.use('/user', userRoute) 
routes.use(audioRoute);
export default routes;




