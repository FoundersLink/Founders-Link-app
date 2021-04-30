import groupController from '../controllers/group.controller';
import authGuard from '../middleware/auth';

const express = require("express");
const router = express.Router();

router.post('/create-group', authGuard, groupController.createGroup);
router.get('/get-members/:id', authGuard, groupController.getGroupMembers);
router.post('/add-people/:id', authGuard, groupController.addPeopleToGroup);
router.delete('/delete-people/:id', authGuard, groupController.deletePeopleFromGroup);

export default router;
