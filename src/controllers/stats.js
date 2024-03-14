import { nodeCache } from "../app.js";
import { Order } from "../models/orders.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/feature.js";
import { TryCatch } from "../utils/utilityClass.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  if (nodeCache.has("admin-stats"))
    stats = JSON.parse(nodeCache.get("admin-stats"));
  else {
    const today = new Date();
    const sixMonthAgo = new Date()
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6)

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), -1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const thisMonthProdctPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthProdctPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthUserPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthUserPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthOrderPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthOrderPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const lastSixMonthOrderPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });

    const latestTransectionPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    }).select(["orderItems","total", "status", "discount"]).limit(4)

    const [
      thisMonthProdct,
      thisMonthUser,
      thisMonthOrder,
      lastMonthProdct,
      lastMonthUser,
      lastMonthOrder,
      productsCount,
      userCount,
      allOrders,
      lastSixMonthOrder,
      femalUsersCount,
      latestTransection,
    ] = await Promise.all([
      thisMonthProdctPromise,
      thisMonthUserPromise,
      thisMonthOrderPromise,
      lastMonthProdctPromise,
      lastMonthUserPromise,
      lastMonthOrderPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrderPromise,
      User.countDocuments({ gender: "female" }),
      latestTransectionPromise,
    ]);

    const thisMonthRevenue = thisMonthOrder.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrder.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const productChangePercentage = calculatePercentage(
      thisMonthProdct.length,
      lastMonthProdct.length
    );

    const userChangePercentage = calculatePercentage(
      thisMonthUser.length,
      lastMonthUser.length
    );

    const orderChangePercentage = calculatePercentage(
      thisMonthOrder.length,
      lastMonthOrder.length
    );

    const revenueChangePercentage = calculatePercentage(
      thisMonthRevenue,
      lastMonthRevenue
    );

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const Count = {
      revenue,
      user: userCount,
      product: productsCount,
      order: allOrders.length,
    };

   const orderMonthCount = new Array(6).fill(0)
   const orderMonthlyRevenue = new Array(6).fill(0)

   lastSixMonthOrder.forEach((order) => {
     const createDate = order.createdAt;
     
     const monthDifference = today.getMonth() - createDate.getMonth();

     if(monthDifference < 6) {
        orderMonthCount[5 -  monthDifference] +=1
        orderMonthlyRevenue[5 -  monthDifference] += order.total
     }

   });

   const userRatio = {
    male: userCount - femalUsersCount,
    female: femalUsersCount
   }

   const modifiedLatestTransection = latestTransection.map((i) => ({
    _id: i._id,
    discount: i.discount,
    amount: i.total,
    status: i.status,
   quantity: i.orderItems.length
   }))

    stats = {
      productChangePercentage,
      userChangePercentage,
      orderChangePercentage,
      revenueChangePercentage,
      Count,
      Chart: {
        order: orderMonthCount,
        revenue: orderMonthlyRevenue
      },
      userRatio,
      latestTransection: modifiedLatestTransection
    };


    nodeCache.set("admin-stats", JSON.stringify(stats))
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieChart = TryCatch(async (req, res, next) => {});

export const getBarChart = TryCatch(async (req, res, next) => {});

export const getLineChart = TryCatch(async (req, res, next) => {});
