import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allCoupon, applyDiscount, createPayment, deleteCoupon, newCoupon } from "../controllers/payment.js";


const app = express.Router()
// route -- /api/v1/payment/create
app.post("/create", createPayment)

// route -- /api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, newCoupon)

// route -- /api/v1/payment/discount
app.get("/discount", applyDiscount)

// route -- /api/v1/payment/coupon/all 
app.get("/coupon/all", adminOnly, allCoupon)


// route -- /api/v1/payment/coupon/_id
app.delete("/coupon/:_id", adminOnly, deleteCoupon)

export default app;