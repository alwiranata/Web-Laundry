import { ServiceCategory, ServiceType, OrderStatus } from "@prisma/client"
import {z} from "zod"

export const OrderItemSchema = z.object({
    serviceType : z.nativeEnum(ServiceType),
    serviceCategory : z.nativeEnum(ServiceCategory),
    priceCategory : z.number().optional(),
    category :z.string().min(1,"Kategori Harus Diisi"),
    weight :z.number().optional(),
    dropOffDate : z.string().datetime("Tanggal Antar Harus Format ISO"),
    pickUpDate :z.string().datetime("Tanggal Ambil Harus Format ISO"),
    status : z.nativeEnum(OrderStatus),
    price  :z.number().optional()
})

export const updateOrderItemSchema = z.object({
    serviceType : z.nativeEnum(ServiceType).optional(),
    serviceCategory : z.nativeEnum(ServiceCategory).optional(),
    priceCategory : z.number().optional(),
    category :z.string().min(1,"Kategori Harus Diisi").optional(),
    weight :z.number().optional().optional(),
    dropOffDate : z.string().datetime("Tanggal Antar Harus Format ISO").optional(),
    pickUpDate :z.string().datetime("Tanggal Ambil Harus Format ISO").optional(),
    status : z.nativeEnum(OrderStatus).optional(),
    price  :z.number().optional()
})

