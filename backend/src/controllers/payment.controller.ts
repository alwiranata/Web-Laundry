import midtransClient from "midtrans-client"
import {Request, Response} from "express"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

const snap = new midtransClient.Snap({
	isProduction: false,
	serverKey: process.env.MIDTRANS_SERVER_KEY!,
})

const core = new midtransClient.CoreApi({
	isProduction: false,
	serverKey: process.env.MIDTRANS_SERVER_KEY!,
	clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})

// ✅ CREATE PAYMENT
export const createPayment = async (req: Request, res: Response) => {
	const {orderId, amount} = req.body

	try {
		const parameter = {
			transaction_details: {
				order_id: orderId,
				gross_amount: amount,
			},
			credit_card: {
				secure: true,
			},
			notification_url: process.env.NOTIFICATION_URL,
		}

		const transaction = await snap.createTransaction(parameter)
		res.status(200).json({paymentUrl: transaction.redirect_url})
	} catch (error: any) {
		console.error("Midtrans Error:", error)
		res.status(500).json({
			message: "Gagal membuat pembayaran",
			detail: error.ApiResponse || error.message,
		})
	}
}

// ✅ HANDLE NOTIFIKASI DARI MIDTRANS
export const midtransNotification = async (req: Request, res: Response) => {
	try {
		const notificationJson = req.body

		const statusResponse = await core.transaction.notification(notificationJson)

		const orderId = statusResponse.order_id
		const transactionStatus = statusResponse.transaction_status
		const fraudStatus = statusResponse.fraud_status

		if (transactionStatus === "settlement" && fraudStatus === "accept") {
			await prisma.order.updateMany({
				where: {uniqueCode: orderId},
				data: {statusPayment: "COMPLETED"},
			})
		} else if (transactionStatus === "expire") {
			await prisma.order.updateMany({
				where: {uniqueCode: orderId},
				data: {statusPayment: "PENDING"},
			})
		} else if (transactionStatus === "cancel" || transactionStatus === "deny") {
			await prisma.order.updateMany({
				where: {uniqueCode: orderId},
				data: {statusPayment: "PENDING"},
			})
		}

		res.status(200).json({message: "Notifikasi berhasil diproses"})
	} catch (error: any) {
		res.status(500).json({message: "Gagal memproses notifikasi"})
	}
}
