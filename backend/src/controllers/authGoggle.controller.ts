// src/controllers/authGoogle.controller.ts
import {Request, Response} from "express"
import axios from "axios"
import jwt from "jsonwebtoken"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const JWT_SECRET = process.env.JWT_SECRET || "secret"
const FRONTEND_REDIRECT =
	process.env.FRONTEND_REDIRECT || "http://localhost:3040/login"

export const redirectToGoogle = (req: Request, res: Response) => {
	const redirectUri = "http://localhost:3000/api/auth/google/callback"
	const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`
	res.redirect(googleUrl)
}

export const handleGoogleCallback = async (req: Request, res: Response) => {
	const code = req.query.code as string

	try {
		// 1. Exchange code for access token
		const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
			code,
			client_id: GOOGLE_CLIENT_ID,
			client_secret: GOOGLE_CLIENT_SECRET,
			redirect_uri: "http://localhost:3000/api/auth/google/callback",
			grant_type: "authorization_code",
		})

		const {access_token} = tokenRes.data

		// 2. Get user info
		const userRes = await axios.get(
			"https://www.googleapis.com/oauth2/v2/userinfo",
			{
				headers: {Authorization: `Bearer ${access_token}`},
			}
		)

		const {email, name} = userRes.data

		// 3. Create or find user in DB
		let user = await prisma.admin.findUnique({where: {email}})

		if (!user) {
			user = await prisma.admin.create({
				data: {
					name,
					email,
					password: "",
					phone: "0895634889510",
				},
			})
		}

		// 4. Create JWT
		const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {
			expiresIn: "1d",
		})

		// 5. Redirect to frontend
		res.redirect(`${FRONTEND_REDIRECT}?token=${token}&email=${user.email}`)
	} catch (err) {
		console.error("Google Auth Error:", err)
		res.status(500).json({message: "Google authentication failed"})
	}
}
