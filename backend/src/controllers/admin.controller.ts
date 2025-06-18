import {Request, RequestHandler, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {PrismaClient} from "@prisma/client"
import {AdminLogin, AdminRegister} from "../models/admin"
import {AdminLoginSchema, AdminRegisterSchema} from "../validators/adminValidator"
import {z} from "zod"
import { AdminRequest } from "../middleware/adminRequest"
import { profile } from "console"
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || "secret"

//Registrasi Admin 
export const registerAdmin = async (req : Request , res : Response): Promise<void> =>{
    try {
        const inputRegisterAdmin  : AdminRegister = AdminRegisterSchema.parse(req.body)

		const existing = await prisma.admin.findUnique({
			where: {email: inputRegisterAdmin.email},
		})

		if (existing) {
			res.status(400).json({
				message: "Email sudah terdaftar",
			})
			return
		}

		const hashedPassword = await bcrypt.hash(inputRegisterAdmin.password, 10)

		const newAdmin = await prisma.admin.create({
			data: {...inputRegisterAdmin, password: hashedPassword},
		})

		const {password, ...adminWithoutPassword} = newAdmin

	    res.status(201).json({
			message: "Registrasi Berhasil",
			admin: adminWithoutPassword,
		})
		
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json({
				errors: Object.fromEntries(
					error.errors.map((err) => [err.path[0], err.message])
				),
			})
			return
		}

		res.status(500).json({
			message: "Terjadi kesalahan pada server",
			error : error
		})
	}
}

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
	try {
		const inputLoginAdmin : AdminLogin = AdminLoginSchema.parse(req.body)

		const admin = await prisma.admin.findUnique({
			where: {email: inputLoginAdmin.email}
		})

		const isMatch = await bcrypt.compare(inputLoginAdmin.password, admin!.password)

		if(!admin || !isMatch) {
			res.status(401).json({
				message : "Email atau Password Salah"
			})
			return
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
			 res.status(400).json({
				errors : Object.fromEntries(
					error.errors.map((err) => [err.path[0], err.message])
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


export const getAdminProfile = async (req : AdminRequest , res : Response) : Promise<void> =>{
	try {
	 const admin = req.user

	 if(!admin){
		res.status(401).json({
			message : "Akses ditolak, token tidak valid"
		})
		return
	 }

	 const {id} = req.params
	 const idAdmin = parseInt(id , 10)

	 if(isNaN(idAdmin)){
		res.status(400).json({
			message : "ID admin tidak valid"
		})
		return
	 }

	 const adminProfile = await prisma.admin.findUnique({
		where : {id : idAdmin}
	 })

	if(!adminProfile){
		res.status(404).json({
			message : "Admin tidak ditemukan"
		})
		return
	}


	res.status(200).json({
		message : "Profil admin berhasil diambil",
		profile : adminProfile
	})


	} catch (error) {
		if(error instanceof z.ZodError){
			res.status(400).json({
				error : Object.fromEntries(
					error.errors.map((err) => [err.path[0], err.message])
				)
			})
		}
		res.status(500).json({
			message : "Terjadi kesalahan pada server",
			error : error
		})
	}
}

export const getAllAdminProfile =async (req: AdminRequest ,res :Response): Promise<void>=>{
	try {
		const admin = req.user
		if(!admin){
			res.status(401).json({
				message : "Akses ditolak, token tidak valid"
			})
		}

		const allAdminProfile = await prisma.admin.findMany({
			orderBy : {
				id : "asc"
			}
		})

		res.status(200).json({
			message : "Semua profil admin berhasil diambil",
			profiles : allAdminProfile
		})
		
	} catch (error) {
		if(error instanceof z.ZodError){
			res.status(400).json({
				error : Object.fromEntries(
					error.errors.map((err) => [err.path[0],err.message])
				)
			})
		}

		res.status(500).json({
			message : "Terjadi kesalahan pada server",
			error : error
		})
	}
}