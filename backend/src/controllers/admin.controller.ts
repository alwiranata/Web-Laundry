import { Request ,Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
import { AdminRegister } from "../models/admin";
import { AdminRegisterSchema } from "../validators/adminValidator";
import {any, z} from "zod"
const prisma  = new PrismaClient

const JWT_SECRET = process.env.JWT_SECRET || "secret"

//Registrasi Admin 
export const registerAdmin = async (req : Request , res : Response): Promise<any> =>{
    try {
        const InputAdmin  : AdminRegister = AdminRegisterSchema.parse(req.body)

        const existing = await prisma.admin.findUnique({where : {email : InputAdmin.email}})
        if(existing){
           return res.status(400).json({
                message : "Email sudah terdaftar"
            })
        }

        const hashedPassword =await bcrypt.hash(InputAdmin.password,10)
        
        const newAdmin = await prisma.admin.create({
            data : {...InputAdmin ,password : hashedPassword}
        })

        const {password , ...adminWithoutPassword} = newAdmin

       return res.status(201).json({
            message : "Registrasi Berhasil",
            admin : adminWithoutPassword
        })

    } catch (error : any ) {
        if(error instanceof z.ZodError){
            return res.status(400).json({
             errors: Object.fromEntries(
               error.errors.map((err : any) => [err.path[0], err.message])
             )
            });
        }

        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            error
        })
    }
}