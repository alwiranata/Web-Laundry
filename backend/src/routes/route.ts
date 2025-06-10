import {Router}from 'express';
import { registerAdmin } from '../controllers/admin.controller';

const router = Router();

//Admin Register
router.post('/admin/register', registerAdmin); 

export default router;
