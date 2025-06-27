import {Request, RequestHandler, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {PrismaClient} from "@prisma/client"
import {AdminLogin, AdminRegister} from "../models/admin"
import {
	AdminLoginSchema,
	AdminRegisterSchema,
	AdminUpdateSchema,
	AdminDeleteSchema,
} from "../validators/adminValidator"
import {z} from "zod"
import {AdminRequest} from "../middleware/adminRequest"
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || "secret"

//Registrasi Admin
export const registerAdmin = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const inputRegisterAdmin: AdminRegister = AdminRegisterSchema.parse(
			req.body
		)

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
			error: error,
		})
	}
}

export const loginAdmin = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const inputLoginAdmin: AdminLogin = AdminLoginSchema.parse(req.body)

		const admin = await prisma.admin.findUnique({
			where: {email: inputLoginAdmin.email},
		})

		const isMatch = await bcrypt.compare(
			inputLoginAdmin.password,
			admin!.password
		)

		if (!admin || !isMatch) {
			res.status(401).json({
				message: "Email atau Password Salah",
			})
			return
		}

		const token = jwt.sign({id: admin.id, email: admin.email}, JWT_SECRET, {
			expiresIn: "1d",
		})

		res.status(200).json({
			message: "Login Berhasil",
			token: token,
			email: admin.email, // ← tambahkan ini agar frontend bisa langsung ambil
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
			error: error,
		})
	}
}

export const getAdminProfile = async (
	req: AdminRequest,
	res: Response
): Promise<void> => {
	try {
		const admin = req.user

		if (!admin) {
			res.status(401).json({
				message: "Akses ditolak, token tidak valid",
			})
			return
		}

		const adminProfile = await prisma.admin.findUnique({
			where: {id: admin.id},
			include: {orders: true},
		})

		if (!adminProfile) {
			res.status(404).json({
				message: "Admin tidak ditemukan",
			})
			return
		}
		const myPrice = adminProfile.orders.reduce(
			(acc, order) => acc + (order.price ?? 0),
			0
		)
		res.status(200).json({
			message: "Profil admin berhasil diambil",
			profile: adminProfile,
			myPrice: myPrice,
			name: adminProfile.name,
		})
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json({
				error: Object.fromEntries(
					error.errors.map((err) => [err.path[0], err.message])
				),
			})
			return
		}
		res.status(500).json({
			message: "Terjadi kesalahan pada server",
			error: error,
		})
	}
}

export const getAllAdminProfile = async (
	req: AdminRequest,
	res: Response
): Promise<void> => {
	try {
		const admin = req.user
		if (!admin) {
			res.status(401).json({
				message: "Akses ditolak, token tidak valid",
			})
		}

		const allAdminProfile = await prisma.admin.findMany({
			orderBy: {
				id: "asc",
			},
		})

		res.status(200).json({
			message: "Semua profil admin berhasil diambil",
			profiles: allAdminProfile,
			length: allAdminProfile.length,
		})
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json({
				error: Object.fromEntries(
					error.errors.map((err) => [err.path[0], err.message])
				),
			})
			return
		}

		res.status(500).json({
			message: "Terjadi kesalahan pada server",
			error: error,
		})
	}
}

export const updateAdmin= async (
  req: AdminRequest,
  res: Response
): Promise<void> => {
  try {
    const admin = req.user;
    if (!admin) {
      res.status(401).json({
        message: "Akses ditolak, token tidak valid",
      });
      return;
    }

    const { email } = req.params;

    if (!email) {
      res.status(400).json({
        message: "Email tidak valid",
      });
      return;
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!existingAdmin) {
      res.status(404).json({
        message: "Admin tidak ditemukan",
      });
      return;
    }

    const input = AdminUpdateSchema.parse(req.body);

    // Cegah update email/password diri sendiri saat login
    if (
      email === req.user?.email &&
      ("email" in input || "password" in input)
    ) {
      res.status(400).json({
        message:
          "Tidak dapat mengubah email atau password akun Anda sendiri saat login.",
      });
      return;
    }

    if (input.password) {
      input.password = await bcrypt.hash(input.password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { email },
      data: input,
    });

    res.status(200).json({
      message: "Admin berhasil diperbarui berdasarkan email",
      data: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
      },
    });
	
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: Object.fromEntries(
          error.errors.map((err) => [err.path[0], err.message])
        ),
      });
      return;
    }

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error,
    });
  }
};


export const deleteAdmin = async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const admin = req.user;
    if (!admin) {
      res.status(401).json({ message: "Akses ditolak, token tidak valid" });
      return;
    }

    const email = req.params.email; // <-- AMBIL DARI PARAMS
	
    if (!email) {
      res.status(400).json({ message: "Email tidak ditemukan di parameter" });
      return;
    }

    const getAdmin = await prisma.admin.findUnique({ where: { email } });

    if (!getAdmin) {
      res.status(404).json({ message: "Admin tidak ditemukan" });
      return;
    }

    if (getAdmin.email === admin.email) {
      res.status(403).json({ message: "Tidak bisa menghapus akun Anda sendiri." });
      return;
    }

    const hashOrders = await prisma.order.findFirst({
      where: { adminId: getAdmin.id },
    });

    if (hashOrders) {
      res.status(403).json({
        message: "Admin memiliki data order, tidak bisa dihapus",
      });
      return;
    }

    const deleted = await prisma.admin.delete({ where: { email } });

    res.status(200).json({
      message: "Admin berhasil dihapus",
      admin: deleted,
    });
  } catch (error) {
     if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: Object.fromEntries(
          error.errors.map((err) => [err.path[0], err.message])
        ),
      });
      return;
    }

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error,
    });
  }
};

export const deleteAllAdmin = async (req : AdminRequest , res : Response): Promise<void> => {
	try {
		const admin = req.user

		if(!admin){
			res.status(401).json({
				message : "Akses ditolak , token tidak valid"
			})
			return
		}
		 
		const allAdmins = await prisma.admin.findMany()

		const  adminsToDelete : string[] = []

		for (const a of allAdmins){
			if(a.email === admin.email) continue

			const hasOrder = await prisma.order.findFirst({
				where: {adminId: a.id}
			})

			if(!hasOrder) {
				adminsToDelete.push(a.email)
			}
		}

		if(adminsToDelete.length === 0){
			res.status(400).json({
				message :   "Admin memiliki data order dan tidak bisa menghapus akun sendiri",
			})
			return
		}

		const deleted = await prisma.admin.deleteMany({
			where : {email :{
				in : adminsToDelete
			}}
		})

		res.status(200).json({
			message : `Berhasil menghapus ${deleted.count} admin.`,
			emails : adminsToDelete
		})

	} catch (error) {
		 if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: Object.fromEntries(
          error.errors.map((err) => [err.path[0], err.message])
        ),
      });
      return;
    }

    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error,
    });
	}
}
