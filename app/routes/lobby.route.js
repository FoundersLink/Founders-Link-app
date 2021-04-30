import lobbyController from '../controllers/lobby.controller';
import authGuard from '../middleware/auth';

const express = require("express");
const router = express.Router();

router.post('/create-lobby', authGuard, lobbyController.createLobby);
router.get('/get-lobby/:id',authGuard, lobbyController.getLobby);

export default router;
