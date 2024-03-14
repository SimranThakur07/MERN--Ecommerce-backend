import { User } from "../models/user.js";
import ErrorHandler, { TryCatch } from "../utils/utilityClass.js";

// Middleware to allow only admin
export const adminOnly = TryCatch(async(req, res, next) => {

    const {_id} = req.query
    if(!_id) return next(new ErrorHandler("Please Login", 401))

    const user =  await User.findById(_id)
    if(!user) return next(new ErrorHandler("Invalid Id", 401))

    if(user.role === 'user') return next(new ErrorHandler("You do not have the Access", 401))

    next() 
})