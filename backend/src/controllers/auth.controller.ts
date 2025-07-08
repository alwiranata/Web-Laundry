import {Request, Response} from "express"
import axios from "axios"
import jwt from "jsonwebtoken"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

const CLIENT_ID = process.env.GITHUB_CLIENT_ID!
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!
const JWT_SECRET = process.env.JWT_SECRET || "secret"
const FRONTEND_REDIRECT = "http://localhost:3040/login"

// Redirect ke GitHub OAuth
export const redirectToGithub = async (req: Request, res: Response) => {
	const redirectUri = "http://localhost:3000/api/auth/github/callback"
	const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`
	res.redirect(githubAuthUrl)
}

// Callback GitHub OAuth
export const handleGithubCallback = async (
	req: Request,
	res: Response
): Promise<void> => {
	const code = req.query.code as string

	if (!code) {
		res.status(400).json({message: "Authorization code not found"})
	}

	try {
		// 1. Tukar code dengan access token
		const tokenRes = await axios.post(
			"https://github.com/login/oauth/access_token",
			{
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				code,
			},
			{headers: {Accept: "application/json"}}
		)

		const accessToken = tokenRes.data.access_token

		// 2. Ambil data user GitHub
		const userRes = await axios.get("https://api.github.com/user", {
			headers: {Authorization: `Bearer ${accessToken}`},
		})
		const githubUser = userRes.data

		// 3. Ambil email utama user GitHub (primary email)
		const emailRes = await axios.get("https://api.github.com/user/emails", {
			headers: {Authorization: `Bearer ${accessToken}`},
		})
		const primaryEmail = emailRes.data.find((e: any) => e.primary)?.email

		const userEmail = primaryEmail ?? githubUser.login + "@github.com"

		// 4. Cek di DB, buat kalau belum ada
		let user = await prisma.admin.findUnique({where: {email: userEmail}})

		if (!user) {
			user = await prisma.admin.create({
				data: {
					name: githubUser.name || githubUser.login,
					email: userEmail,
					password: "",
					phone: "0895634889510",
				},
			})
		}

		// 5. Buat JWT
		const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {
			expiresIn: "1d",
		})

		// 6. Redirect ke frontend dengan token dan email
		res.redirect(`${FRONTEND_REDIRECT}?token=${token}&email=${user.email}`)
	} catch (err) {
		console.error("GitHub Auth Error:", err)
		res.status(500).json({message: "GitHub authentication failed"})
	}
}

