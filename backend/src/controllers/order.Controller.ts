import { Request ,Response  } from "express";
import { Admin, Prisma, PrismaClient, ServiceCategory } from "@prisma/client";
import { OrderItemSchema } from "../validators/orderValidator";
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
        message: "Akses Ditolak, Token Tidak Valid"
      });
      return;
    }

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      message: `Daftar order berhasil diambil oleh admin: ${admin.email}`,
      data: orders
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
                message : "Akses Ditolak , Token tidak  Valid"
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
        message : "Order Berhasil Dibuat",
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