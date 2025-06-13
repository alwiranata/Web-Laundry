import { Request } from "express";
import { AdminPayLoad } from "../models/admin";

 export interface AdminRequest extends Request {
    user? : AdminPayLoad
 }