import groupController from '../controllers/group.controller';
import authGuard from '../middleware/auth';

const express = require("express");
const router = express.Router();

router.post('/create-group', authGuard, groupController.createGroup);
router.get('/get-members', authGuard, groupController.getGroupMembers);
router.post('/add-people', authGuard, groupController.addPeopleToGroup);
router.patch('/delete-people', authGuard, groupController.deletePeopleFromGroup);

export default router;
