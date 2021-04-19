import userController from '../controllers/user.controller';
import authController from '../controllers/auth.controller';
import authGuard from '../middleware/auth';

const express = require("express");
const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.createNewUser);
router.post('/logout', authGuard, authController.logout);
router.post('/logoutall', authGuard, authController.logoutAll);
router.get('/profile', authGuard, userController.getUser);
router.patch('/profile', authGuard, userController.updateUser);
router.delete('/profile', authGuard, userController.deleteUserAccount);
router.get('/activate/:autorizations', verifyToken.paramToken, authController.activateUser);

export default router;