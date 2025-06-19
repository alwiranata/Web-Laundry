import {z} from 'zod'

export const AdminRegisterSchema = z.object({
    name: z.string().min(1,{message : "Nama Harus Diisi"}),
    email:z.string().email("Email Tidak valid"),
    password : z.string().min(1,{message:"Password Harus Diisi"}),
    phone : z.string().min(12,{message:"Nomor Telepon Harus Diisi"})
})

export const AdminLoginSchema = z.object({
    email : z.string().email("Email Tidak Valid"),
    password : z.string().min(1,{message : "Password  Harus Diisi"})
})

export const AdminUpdateSchema = z.object({
    name: z.string().min(1,{message : "Nama Harus Diisi"}).optional(),
    email:z.string().email("Email Tidak valid").optional(),
    password : z.string().min(1,{message:"Password Harus Diisi"}).optional(),
    phone : z.string().min(12,{message:"Nomor Telepon Harus Diisi min"}).optional()
})
