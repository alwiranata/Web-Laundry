import {Router}from 'express';
import { 
    registerAdmin,
    loginAdmin
} from '../controllers/admin.controller';

const router = Router();

//Admin Register
router.post('/admin/register', registerAdmin); 

//Admin Login 
router.post('/admin/login',loginAdmin)
export default router;
