import {Router}from 'express';
import { 
    registerAdmin,
    loginAdmin,
    dashboardAdmin
} from '../controllers/admin.controller';
import authenticateToken from '../middleware/authenticateToken';
import { createOrder } from '../controllers/order.Controller';

const router = Router();

//Admin Register
router.post('/admin/register', registerAdmin); 

//Admin Login 
router.post('/admin/login',loginAdmin)

router.get('/admin/dashboard',authenticateToken, dashboardAdmin)

router.post('/order/create',authenticateToken, createOrder )
export default router;
