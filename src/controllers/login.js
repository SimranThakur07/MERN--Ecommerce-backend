import { User } from "../models/user.js";
import ErrorHandler, { TryCatch } from "../utils/utilityClass.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';

export const userLogin = TryCatch(async (req, res, next) => {
const { email, password } = req.body

if(!email || !password) return next(new ErrorHandler("Please provide Email and Password"))

const user = await User.findOne({email})
if(!user) return next(new ErrorHandler("Invalid Email", 401))

 const isPasswordMatch = await bcrypt.compare(password, user.password);

 if (!isPasswordMatch) return next(new ErrorHandler("Invalid Email or Password", 401))

 
 const token = jwt.sign({ userId: user._id }, 'yourSecretKey');
 
 return res.status(200).json({
    success: true,
    message: 'Login Successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender
    },
    token,
  });
})