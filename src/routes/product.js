import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { deleteProduct, getAdminProducts, getAllProducts, getBestProduct, getCategory, getLatestProduct, getProductDetails, newProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";


const app = express.Router()
// route -- /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct)
// route -- /api/v1/product/latest
app.get("/latest", getLatestProduct)

// route -- /api/v1/product/latest
app.get("/bestseller", getBestProduct)

//Get all products with filter
// route -- /api/v1/product/all
app.get("/all", getAllProducts)
// route -- /api/v1/product/categories
app.get("/categories", getCategory)

// route -- /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts)

app.route("/:_id").get(getProductDetails).put( adminOnly, singleUpload, updateProduct).delete(adminOnly, deleteProduct)

export default app