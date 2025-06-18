import {Router}from 'express';
import { 
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    getAllAdminProfile,
} from '../controllers/admin.controller';
import authenticateToken from '../middleware/authenticateToken';
import { 
    createOrder,
    getOrderForUser,
    getAllOrder,
    updateOrder,
    deleteOrder

 } from '../controllers/order.Controller';

const router = Router();

//Admin Register
router.post('/admin/register', registerAdmin); 

//Admin Login 
router.post('/admin/login',loginAdmin)

//get Admin 
router.get("/admin/getProfile/:id",authenticateToken, getAdminProfile)

//get  AllAdmins
router.get("/admin/getAllProfile", authenticateToken, getAllAdminProfile )

//Cretes orders
router.post('/order/create',authenticateToken, createOrder )

//get All Order
router.get("/order/getAll", authenticateToken, getAllOrder)

//get Order For User
router.get('/order/get/:uniqueCode', getOrderForUser)

//update Order
router.put('/order/update/:id', authenticateToken, updateOrder)

//delete Order
router.delete('/order/delete/:id', authenticateToken, deleteOrder)


export default router;
