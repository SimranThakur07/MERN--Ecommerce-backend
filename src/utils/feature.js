import mongoose from "mongoose"
import { nodeCache } from "../app.js"
import { Product } from "../models/product.js"
import { Order } from "../models/orders.js"



export const connectDB = (uri) => {
    mongoose.connect(uri, {
        dbName: "eCommerce"
    }).then(c => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e))
}

export const invalidateCache = ({product, order, admin, userId, orderId, productId}) => {
    if(product){
        const productKeys = [ "adminproducts", "categories", "latestProducts", "bestProducts"]

        if(typeof productId === "string") productKeys.push(`product-${productId}`)
        if(typeof productId === "object") productKeys.forEach(i =>  productKeys.push(`product-${i}`));
        nodeCache.del(productKeys)
    }
    if(order){
        const orderKeys = [ "allorders", `orders-${userId}`, `order-${orderId}`]
        nodeCache.del(orderKeys)
    }
    if(admin){
        nodeCache.del(["admin-stats"])

    }
}


export const reduceStock = async(orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];

        const product = await Product.findById(order.productId)
        if(!product) throw new Error("Product Not Found")

        product.stock -= order.quantity
        await product.save()
    }
}

export const calculatePercentage = (thisMonth, lastMonth) => {

if(lastMonth === 0) return thisMonth * 100    
const percentage = (thisMonth / lastMonth) * 100
return Number(percentage.toFixed(0))

}


 