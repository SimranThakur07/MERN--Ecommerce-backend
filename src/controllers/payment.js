import { stripe } from "../app.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler, { TryCatch } from "../utils/utilityClass.js";

export const createPayment = TryCatch(async (req, res, next) => {
  const { amount, description , name, email, address} = req.body;

  if (!amount) return next(new ErrorHandler("Please Enter Amount", 400));


  const customer = await stripe.customers.create({
    name,
    email,
    address: {
      line1: address.line1,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country
    }
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "INR",
    description,
    customer: customer.id
  });

  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
}); 

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;

  if (!coupon || !amount)
    return next(new ErrorHandler("Please Provide all feilds", 400));

  await Coupon.create({ coupon, amount });

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} Created Successfully`,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;

  const discount = await Coupon.findOne({ coupon });

  if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));

  return res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});

export const allCoupon = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  return res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { _id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(_id);

  if (!coupon) return next(new ErrorHandler("Invalid Coupon Code", 400));

  return res.status(200).json({
    success: true,
    message: `Coupon Deleted Successfully`,
  });
});
