import mongoose from "mongoose";
import validator  from 'validator'


const schema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter Email'],
        validate: validator.default.isEmail,
    },
    password: {
        type: String,
        required: [true, 'Please enter Password'],
    },
    

},  
{
    timestamps: true,
  }
)


export const Login = mongoose.model("Login", schema)