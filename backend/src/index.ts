import express from "express"
import dotenv from "dotenv"
import router from "./routes/route"
dotenv.config()

const app = express()
app.use(express.json())

app.use("/api", router)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
})