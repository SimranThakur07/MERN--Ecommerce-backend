import { nodeCache } from "../app.js";
import { Order } from "../models/orders.js";
import { invalidateCache, reduceStock } from "../utils/feature.js";
import ErrorHandler, { TryCatch } from "../utils/utilityClass.js";

export const myOrder = TryCatch(async (req, res, next) => {
  const { _id: user } = req.query;

  let orders;
  if (nodeCache.has(`orders-${user}`))
    orders = JSON.parse(nodeCache.get(`orders-${user}`));
  else {
    orders = await Order.find({ user });
    nodeCache.set(`orders-${user}`, JSON.stringify(orders));
  }
  return res.status(201).json({
    success: true,
    orders,
  });
});

export const allOrder = TryCatch(async (req, res, next) => {
  let orders;
  if (nodeCache.has(`allorders`))
    orders = JSON.parse(nodeCache.get(`allorders`));
  else {
    orders = await Order.find().populate("user", "name");
    nodeCache.set(`allorders`, JSON.stringify(orders));
  }
  return res.status(201).json({
    success: true,
    orders,
  });
});

export const orderDetails = TryCatch(async (req, res, next) => {
  const { _id } = req.params;
  let order;
  if (nodeCache.has(`order-${_id}`))
    order = JSON.parse(nodeCache.get(`order-${_id}`));
  else {
    order = await Order.findById(_id).populate("user", "name");
    if (!order) next(new ErrorHandler("Order Not Found", 404));
    nodeCache.set(`order-${_id}`, JSON.stringify(order));
  }
  return res.status(200).json({
    success: true,
    order,
  });
});

export const newOrder = TryCatch(async (req, res, next) => {
  const {
    shippingInfo,
    user,
    subTotal,
    total,
    tax,
    shippingCharges,
    discount,
    orderItems,
  } = req.body;

  if (!shippingInfo || !user || !subTotal || !total || !tax || !orderItems)
    return next(new ErrorHandler("Please provide all details", 400));
  const order = await Order.create({
    shippingInfo, 
    user,
    subTotal,
    total,
    tax,
    shippingCharges,
    discount,
    orderItems,
  });      

  await reduceStock(orderItems);

  invalidateCache({ product: true, order: true, admin: true, userId: user, productId: order.orderItems.map(i => i.productId) });

  return res.status(201).json({
    success: true,
    message: "Order Placed Successfully",
  });
});

export const processOrder = TryCatch(async (req, res, next) => {
  const { _id } = req.params;
  const order = await Order.findById(_id);
  if (!order) return next(new ErrorHandler("Order not Found", 404));
  switch (order.status) {
    case "Processing":
      order.status = "Shipping";
      break;
    case "Shipping":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: order._id
  });

  return res.status(200).json({
    success: true,
    message: "Order Processed Successfully",
  });
});
export const deleteOrder = TryCatch(async (req, res, next) => {
  const { _id } = req.params;
  const order = await Order.findById(_id);
  if (!order) return next(new ErrorHandler("Order not Found", 404));
  await order.deleteOne();

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: order._id
  });

  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});
