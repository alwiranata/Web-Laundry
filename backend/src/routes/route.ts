import {Router}from 'express';
import { 
    registerAdmin,
    loginAdmin,
} from '../controllers/admin.controller';
import authenticateToken from '../middleware/authenticateToken';
import { 
    createOrder,
    getOrderForUser
 } from '../controllers/order.Controller';

const router = Router();

//Admin Register
router.post('/admin/register', registerAdmin); 

//Admin Login 
router.post('/admin/login',loginAdmin)

//Cretes orders
router.post('/order/create',authenticateToken, createOrder )

//get Order For User
router.get('/order/:uniqueCode' ,getOrderForUser)
export default router;
