import { Request ,Response  } from "express";
import {  PrismaClient } from "@prisma/client";
import { OrderItemSchema ,updateOrderItemSchema } from "../validators/orderValidator";
import {z} from "zod"
import { generateUniqueCode } from "../utils/generateCode";
import { Order } from "../models/order";
import {AdminRequest} from "../middleware/adminRequest";
const prisma = new PrismaClient

export const getOrderForUser = async(req : Request , res : Response ) : Promise<void> =>{
    try {
        const {uniqueCode} = req.params

        const  order = await prisma.order.findMany({
            where : {
               uniqueCode : uniqueCode
            },

            orderBy : {
                createdAt: "desc"
            }
        })
        res.status(200).json({
            message : "Order Ditemukan",
            order : order
        })
    } catch (error) {
        if(error instanceof z.ZodError){
           res.status(400).json({
                errors : Object.fromEntries(
                    error.errors.map((err) => [err.path[0], err.message]) 
                )
            })
            return
        }
    }
}

export const getAllOrder = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const admin = req.user;

    if (!admin) {
      res.status(401).json({
        message: "Akses ditolak, token tidak valid"
      });
      return;
    }

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "asc"
      }
    });


    const allPrices = orders.reduce((acc, order) => acc + (order.price || 0), 0);

    res.status(200).json({
      message: `Daftar order berhasil diambil oleh admin: ${admin.email}`,
      allPrices : allPrices,
      orders : orders.length 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: Object.fromEntries(
          error.errors.map((err) => [err.path[0], err.message])
        )
      });
      return;
    }

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      errors: error
    });
  }
};


export const createOrder = async(req :AdminRequest , res : Response ) :Promise<void> =>{
    try {
        const admin  = req.user 

        if(!admin){
            res.status(401).json({
                message : "Akses ditolak , token tidak  valid"
            })
            return
        }

        const input :Order = OrderItemSchema.parse(req.body)
        const priceCategory = input.priceCategory ?? 0 
        const weight = input.weight ?? 0

        const price =(input.priceCategory !== 0 && input.weight !== 0)  ? priceCategory * weight : input.price


       const newOrder = await prisma.order.create({
        data : {
            uniqueCode : generateUniqueCode(),
            adminId : admin.id,
            serviceType : input.serviceType,
            serviceCategory : input.serviceCategory,
            priceCategory : priceCategory, 
            category : input.category,
            weight : weight ,
            dropOffDate : new Date(input.dropOffDate),
            pickUpDate : new Date(input.pickUpDate),
            status : input.status,
            price  : price ?? 0
        }
       })

       res.status(201).json({
        message : "Order berhasil dibuat",
        order : newOrder
       })
    } catch (error) {
        if(error instanceof z.ZodError){
            res.status(400).json({
                errors : Object.fromEntries(
                    error.errors.map((err) => [err.path[0], err.message]) 
                )
            })
            return
        }

        res.status(500).json({
            message : "Terjadi Kesalahan pada server",
            error :error
        })
    }
}

export const updateOrder = async(req : AdminRequest ,res : Response) =>{
  try {
    const admin = req.user 
    
    if(!admin){
      res.status(401).json({
        message : "Akses ditolak, token tidak  valid"
      })
      return
    }

    const {id} = req.params
    const idOrder = parseInt(id,10)

    if(isNaN(idOrder)) {
      res.status(400).json({
        message : "ID order tidak ditemukan"
      })
      return
    }

    const input  = updateOrderItemSchema.parse(req.body)
    const priceCategory = input.priceCategory ?? 0
    const weight = input.weight ?? 0

    const price = (input.priceCategory !== 0 && input.weight !== 0) ? priceCategory * weight : input.price

    const existingOrder = await  prisma.order.findUnique({
      where : {id : idOrder}
    })

    if(!existingOrder){
      res.status(404).json({
        message : "Order tidak ditemukan"
      })
      return
    }

    const updateOrder  = await prisma.order.update({
      where : {id : idOrder},
      data :{
        ...input,
        price
      }
    })

    res.status(200).json({
      mesaage : "Order berhasil diperbarui",
      data : updateOrder
    })

  } catch (error) {
    if(error instanceof z.ZodError){
      res.status(400).json({
        errors : Object.fromEntries(
          error.errors.map((err) =>[err.path[0], err.message])
        )
      })
      return
    }
    res.status(500).json({
      message : "Terjadi kesalahan pada server",
      error : error
    })
  }
}

export const deleteOrder  = async(req : AdminRequest , res : Response) =>{
  try {
    const admin = req.user

    if(!admin){
      res.status(401).json({
        message : "Akses ditolak, token tidak valid"
      })
      return
    }

    const {id} = req.params
    const idOrder = parseInt(id, 10)

    if(isNaN(idOrder)){
      res.status(400).json({
        message : "ID order tidak ditemukan"
      })
      return
    }


    const existingOrder =  await prisma.order.findUnique({
      where : {id : idOrder}
    })

    if(!existingOrder){
      res.status(404).json({
        message : "Order tidak ditemukan"
      })
      return
    }

    const deletedOrder = await prisma.order.delete({
      where : {id : idOrder}
    })

    res.status(200).json({
      "meesage" : "Order berhasil dihapus",
      data: deletedOrder
    })

  } catch (error) {
    if(error instanceof z.ZodError){
      res.status(400).json({
        error : Object.fromEntries(
          error.errors.map((err) => [err.path[0],err.message])
        )
      })
      return
    }
    res.status(500).json({
      message : "Terjadi kesalahan pada server",
      error : error
    })
  }
}


