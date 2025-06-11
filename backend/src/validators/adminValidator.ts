import {z} from 'zod'

export const AdminRegisterSchema = z.object({
    name: z.string().min(1,{message : "Nama Harus Diisi"}),
    email:z.string().email("Email Tidak valid"),
    password : z.string().min(1,{message:"Password Harus Diisi"}),
    phone : z.string().min(12,{message:"Nomor Telepon Harus Diisi"})
})