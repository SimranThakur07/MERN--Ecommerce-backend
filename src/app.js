import express from 'express'
import { connectDB } from './utils/feature.js'
import { errorMidddleWare } from './middlewares/error.js'
import { config } from "dotenv";
import Stripe from "stripe"
import NodeCache from "node-cache";
import userRoutes from  './routes/user.js'
import loginRoutes from  './routes/login.js'
import productRoutes from './routes/product.js'
import orderRoutes from './routes/orders.js'
import paymentRoutes from './routes/payment.js'
import statsRoutes from './routes/stats.js'
import morgan  from "morgan";
import cors from "cors"
config({
  path: "./.env"
})

const port = process.env.PORT|| 8000
const mongoURI = process.env.MONGO_URI || ""
const stripeKey = process.env.STRIPE_KEY || ""
connectDB(mongoURI)

export const stripe = new Stripe(stripeKey)
export const nodeCache = new NodeCache()
const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors())
app.get("/", (req, res) => {
  res.send("API Working with api/v1") 
})
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/login", loginRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/dashboard", statsRoutes)

app.use("/uploads", express.static("uploads"))
app.use(errorMidddleWare)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
   