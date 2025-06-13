import  jwt from "jsonwebtoken"
import { Response, NextFunction } from "express"
import { AdminRequest } from "./adminRequest"
import { AdminPayLoad }  from "../models/admin"

const authenticateToken = (req: AdminRequest, res : Response , next : NextFunction) : void  =>{
    const authHeader = req.headers["authorization"]

    const token = authHeader && authHeader.split(" ")[1]

    if(!token){ 
        res.status(401).json({
            message : "Aksese ditolak token tidak ditemukan"
        })
        return
    }

    jwt.verify(token,  process.env.JWT_SECRET as string, (err ,user) =>{
        if(err){
            res.status(403).json({
                message : "Akses ditolak token tidak valid"
            })
            return 
        }

        req.user = user as AdminPayLoad
        next()
    })
}
export default authenticateToken