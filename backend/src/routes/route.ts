import {Router}from 'express';
import { 
    registerAdmin,
    loginAdmin,
    dashboardAdmin
} from '../controllers/admin.controller';
import authenticateToken from '../middleware/authenticateToken';

const router = Router();

//Admin Register
router.post('/admin/register', registerAdmin); 

//Admin Login 
router.post('/admin/login',loginAdmin)

router.get('/admin/dashboard',authenticateToken, dashboardAdmin)
export default router;
