import adminController from '../controllers/admin.controller';
import publicController from '../controllers/public.controller';
import auth  from '../middleware/auth';

const express = require("express");
const router = express.Router();
/// Admin Module {id} 
router.post('/admin/module', auth, adminController.createModule);
router.get('/admin/module', auth, adminController.getAllModule);
router.get('/admin/module/marked', auth, adminController.getModuleMarked);
router.get('/admin/module/:id', auth, adminController.getModule);
router.patch('/admin/module/:id', auth, adminController.updateModule);
router.patch('/admin/module/-/:id', auth, adminController.markTodeleteModule);
router.delete('/admin/module/:id', auth, adminController.deleteModule);
/// Audio Module {id} and audioId
router.post('/admin/module/:id/audio', auth, adminController.postAudio);
router.patch('/admin/module/:id/audio/:audioId', auth, adminController.updateAudio);
router.delete('/admin/module/:id/audio/:audioId', auth, adminController.deleteAudio);
/// Public access
router.get('/public/module', publicController.getAllModule);
router.get('/public/module/:id', auth, publicController.getModule);

export default router;