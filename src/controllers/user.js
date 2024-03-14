import { User } from "../models/user.js";
import ErrorHandler, { TryCatch } from "../utils/utilityClass.js";
import bcrypt from "bcrypt"
export const newUser = TryCatch(async (req, res, next) => {
  const { name, email, password, gender } = req.body;

  let user = await User.findOne({email});
  if (user) return next(new ErrorHandler("Email Already Registered", 400))
    if(!name || !email || !password ||  !gender )
    return next(new ErrorHandler("Please  provide  all  fields",400))

   const hasedPassword = await bcrypt.hash(password,10)

    // Create a new user
  user = await User.create({
    name,
    email,
    password: hasedPassword,
    gender,
  });
  return res.status(201).json({
    success: true,
    message: `${user.name} Your Account Created Successfully`,
  });
});

export const getAllUsers = TryCatch(async(req, res, next) => {
  const users =  await User.find({})
  return res.status(200).json({
    success: true,
    users
  })
})
export const getUser = TryCatch(async(req, res, next) => {
  const _id = req.params._id
  const user =  await User.findById(_id)
  if(!user) return next(new ErrorHandler("Invalid Id", 400))
  return res.status(200).json({
    success: true,
    user
  })
})
export const deleteUser = TryCatch(async(req, res, next) => {
  const _id = req.params._id
  const user =  await User.findById(_id)
  if(!user) return next(new ErrorHandler("Invalid Id", 400))

  await user.deleteOne()
  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully"
  })
})