import ErrorHandler from "../utils/utilityClass.js"

export const errorMidddleWare = (err, req, res, next) => {
    err.message ||= "Internal Server Error"
    err.statusCode ||= 500

   if(err.name === "CastError") err.message = "Invalid Id"
      
    return res.status(err.statusCode).json({ 
     success: false,
     message: err.message
    })
   }