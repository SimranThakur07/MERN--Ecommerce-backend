import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allOrder, deleteOrder, myOrder, newOrder, orderDetails, processOrder } from "../controllers/orders.js";


const app = express.Router()
// route -- /api/v1/orders/new
app.post("/new", newOrder)

// route -- /api/v1/orders/myOrder
app.get("/myOrder", myOrder)

// route -- /api/v1/orders/allOrder
app.get("/allOrder", adminOnly, allOrder)

app.route("/:_id").get(orderDetails).put(adminOnly, processOrder).delete(adminOnly, deleteOrder)
export default app