import { Request ,Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
import { AdminRegister } from "../models/admin";
const prisma  = new PrismaClient

const JWT_SECRET = process.env.JWT_SECRET || "secret"

//Registrasi Admin 
export const registerAdmin = async (req : Request , res : Response)=>{
    const InputAdmin  : AdminRegister = req.body

    try {
        const existing = await prisma.admin.findUnique({where : {email : InputAdmin.email}})
        if(existing){
            res.status(400).json({
                message : "Email sudah terdaftar"
            })
        }

        const hashedPassword =await bcrypt.hash(InputAdmin.password,10)
        
        const newAdmin = await prisma.admin.create({
            data : {...InputAdmin ,password : hashedPassword}
        })

        const {password , ...adminWithoutPassword} = newAdmin

        res.status(201).json({
            message : "Registrasi Berhasil",
            admin : adminWithoutPassword
        })

    } catch (error) {
        res.status(500).json({
            message: "Gagal Login",
            error,
        })
    }
}