import {Router}from 'express';
import { 
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    getAllAdminProfile,
    deleteAdmin,
    updateAdmin,
    deleteAllAdmin,
} from '../controllers/admin.controller';
import authenticateToken from '../middleware/authenticateToken';
import { 
    createOrder,
    getOrderForUser,
    getAllOrder,
    updateOrder,
    deleteOrder,
    deleteAllOrder,
    getMyOrder
 } from '../controllers/order.Controller';

import {createPayment, midtransNotification} from "../controllers/payment.controller"
import {redirectToGithub ,handleGithubCallback} from "../controllers/auth.controller"
import { redirectToGoogle ,handleGoogleCallback } from '../controllers/authGoggle.controller';
const router = Router();

//Admin Register
router.post('/admin/register', registerAdmin); 

//Admin Login 
router.post('/admin/login',loginAdmin)

//get Admin 
router.get("/admin/getProfile",authenticateToken, getAdminProfile)

//get  AllAdmins
router.get("/admin/getAllProfile", authenticateToken, getAllAdminProfile )

//delete Admin
router.delete("/admin/deleteAdmin/:email", authenticateToken, deleteAdmin);

//delete AllAdmin
router.delete('/admin/deleteAllAdmin',authenticateToken, deleteAllAdmin)

//update Admin
router.put("/admin/updateAdmin/:email", authenticateToken, updateAdmin )

//Create Orders
router.post('/order/create',authenticateToken, createOrder )

//get All Order
router.get("/order/getAll", authenticateToken, getAllOrder)

//get All Order
router.get("/order/getMyOrder", authenticateToken, getMyOrder)

//get Order For User
router.get('/order/get/:uniqueCode', getOrderForUser)

//update Order
router.put('/order/update/:uniqueCode', authenticateToken, updateOrder)

//delete Order
router.delete('/order/delete/:uniqueCode', authenticateToken, deleteOrder)

//delete AllOrder
router.delete('/order/deleteAllOrder', authenticateToken ,deleteAllOrder)

//paymnet 
router.post("/payment", createPayment)
router.post("/payment/notification", midtransNotification)

//github
router.get('/auth/github', redirectToGithub)
router.get('/auth/github/callback', handleGithubCallback)

//goggle
router.get('/auth/google', redirectToGoogle);
router.get('/auth/google/callback', handleGoogleCallback);

export default router;
