import userController from '../controllers/user.controller';
import authController from '../controllers/auth.controller';
import authGuard from '../middleware/auth';

const express = require("express");
const router = express.Router();

router.post('/user/login', authController.login);
router.post('/user/signup', authController.createNewUser);
router.post('/user/logout', authGuard, authController.logout);
router.post('/user/logoutall', authGuard, authController.logoutAll);
router.get('/user/profile', authGuard, userController.getUser);
router.patch('/user/profile', authGuard, userController.updateUser);
router.delete('/user/profile', authGuard, userController.deleteUserAccount);

export default router;