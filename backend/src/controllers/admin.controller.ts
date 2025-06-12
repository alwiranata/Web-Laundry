import {Request, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {PrismaClient} from "@prisma/client"
import {AdminLogin, AdminRegister} from "../models/admin"
import {AdminLoginSchema, AdminRegisterSchema} from "../validators/adminValidator"
import {any, z} from "zod"
import { console } from "inspector"
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || "secret"

//Registrasi Admin 
export const registerAdmin = async (req : Request , res : Response): Promise<any> =>{
    try {
        const inputRegisterAdmin  : AdminRegister = AdminRegisterSchema.parse(req.body)

		const existing = await prisma.admin.findUnique({
			where: {email: inputRegisterAdmin.email},
		})

		if (existing) {
			return res.status(400).json({
				message: "Email sudah terdaftar",
			})
		}

		const hashedPassword = await bcrypt.hash(inputRegisterAdmin.password, 10)

		const newAdmin = await prisma.admin.create({
			data: {...inputRegisterAdmin, password: hashedPassword},
		})

		const {password, ...adminWithoutPassword} = newAdmin

		return res.status(201).json({
			message: "Registrasi Berhasil",
			admin: adminWithoutPassword,
		})
		
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				errors: Object.fromEntries(
					error.errors.map((err: any) => [err.path[0], err.message])
				),
			})
		}

		return res.status(500).json({
			message: "Terjadi kesalahan pada server",
			error : error
		})
	}
}

export const loginAdmin = async (req: Request, res: Response): Promise<any> => {
	try {
		const inputLoginAdmin : AdminLogin = AdminLoginSchema.parse(req.body)

		const admin = await prisma.admin.findUnique({
			where: {email: inputLoginAdmin.email}
		})

		const isMatch = await bcrypt.compare(inputLoginAdmin.password, admin!.password)

		if(!admin || !isMatch) {
			return res.status(401).json({
				message : "Email atau Password Salah"
			})
		}

		const token = jwt.sign(
			{id : admin.id , email : admin.email},
			JWT_SECRET,
			{expiresIn : "1d"}
		)

		const {password , ...adminWithoutPassword} = admin
		res.status(200).json({
			message : "Login Berhasil",
			token : token ,
			admin : adminWithoutPassword,
		})
	} catch (error) {
		if(error instanceof z.ZodError){
			return res.status(400).json({
				errors : Object.fromEntries(
					error.errors.map((err : any) => [err.path[0], err.message])
				)
			})
		}

        res.status(500).json({
            message : "Terjadi kesalahan pada server",
            error : error
        })
    }
}
