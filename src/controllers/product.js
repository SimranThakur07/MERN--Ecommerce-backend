import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";
import { invalidateCache } from "../utils/feature.js";
import ErrorHandler, { TryCatch } from "../utils/utilityClass.js";
import { rm } from "fs";

export const getLatestProduct = TryCatch(async (req, res, next) => {
  let products; 
  if(nodeCache.has("latestProducts")) 
  products = JSON.parse(nodeCache.get("latestProducts"))

else{
  products = await Product.find({}).sort({ createdAt: -1 }).limit(8);
  nodeCache.set("latestProducts",JSON.stringify(products))
}
return res.status(200).json({
    success: true,
    products, 
  });
});

export const getBestProduct = TryCatch(async (req, res, next) => {
  let products; 
  if(nodeCache.has("bestProducts")) 
  products = JSON.parse(nodeCache.get("bestProducts"))

else{
  products = await Product.find({}).sort({ createdAt: -1 }).limit(14);
  nodeCache.set("bestProducts",JSON.stringify(products))
}
return res.status(200).json({
    success: true, 
    products, 
  });
}); 

export const getCategory = TryCatch(async (req, res, next) => {
let categories;
if(nodeCache.has(`categories`)) 
categories = JSON.parse(nodeCache.get("categories"))

else{
  categories = await Product.distinct("category");
  nodeCache.set("categories",JSON.stringify(categories))
}
  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
let products;
if(nodeCache.has(`adminproducts`)) 
products = JSON.parse(nodeCache.get("adminproducts"))

else{
  products = await Product.find({});
 nodeCache.set("adminproducts",JSON.stringify(products))
}
  return res.status(200).json({
    success: true,
    products,
  });
});
export const getProductDetails = TryCatch(async (req, res, next) => {
let product;
if(nodeCache.has(`product-${req.params._id}`)) 
product = JSON.parse(nodeCache.get(`product-${req.params._id}`))

else{
   product = await Product.findById(req.params._id);
  if (!product) return next(new ErrorHandler("Invalid Product Id", 404));

  nodeCache.set(`product-${req.params._id}`,JSON.stringify(product))
}
  return res.status(200).json({
    success: true,
    product,
  });
});
       
export const newProduct = TryCatch(async (req, res, next) => {
  const { name, category, stock, price } = req.body;
  const photo = req.file;
  if (!photo) return next(new ErrorHandler("Please add photo", 400));

  if (!name || !category || !stock || !price) {
    rm(photo.path, () => {
      console.log("Deleted");
    });

    return next(new ErrorHandler("Please enter all feilds", 400));
  }
  await Product.create({
    name,
    category: category.toLowerCase(),
    stock,
    price,
    photo: photo.path,
  });
   invalidateCache({product: true, admin: true})
  return res.status(201).json({
    success: true,
    message: `Product created Successfully`,
  });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const { _id } = req.params;
  const { name, category, stock, price } = req.body;
  const photo = req.file;
  const product = await Product.findById(_id);
  if (!product) return next(new ErrorHandler("Invalid Product Id", 404));
  if (photo) {
    rm(product.photo, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (category) product.category = category;
  if (stock) product.stock = stock;
  if (price) product.price = price;
 

  await product.save();
   invalidateCache({product: true, productId: product._id, admin: true})
  return res.status(200).json({
    success: true,
    message: `Product updated Successfully`,
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params._id);

  if (!product) return next(new ErrorHandler("Invalid Product Id", 404));
  rm(product.photo, () => {
    console.log("Product Photo Deleted");
  });


  await product.deleteOne();
 invalidateCache({product: true, productId: product._id, admin: true})
  return res.status(200).json({
    success: true,
    message: `Product deleted Successfully`,
  });
});

export const getAllProducts = TryCatch(async (req, res, next) => {
  const { sort, search, price, category } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
  const skip = (page - 1) * limit; 
  const baseQuery = {};

  if (search)
    baseQuery.name = {
      $regex: search,
      $options: "i",
    };
  if (price)
    baseQuery.price = {
      $lte: price,
    };
  if (category)
    baseQuery.category = category
    
    const [products, allProduct] = await Promise.all([
      Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip), Product.find(baseQuery)
    ])

    const totalPage = Math.ceil(allProduct.length / limit)
  return res.status(200).json({
    success: true,
    products,
    totalPage
  });
});


