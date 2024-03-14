import mongoose from 'mongoose'
import validator  from 'validator'


const schema = mongoose.Schema({
   
    name: {
        type: String,
        required: [true, 'Please enter Name'],
    },
    email: {
        type: String,
        unique: [true, "Email already Exist"],
        required: [true, 'Please enter Email'],
        validate: validator.default.isEmail,
    },
    password: {
        type: String,
        required: [true, 'Please enter Password'],
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: "user"
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'Please enter  Gender'],
    },
    dob: {
        type: Date,
    },
}, 
{
 timestamps: true,
})
schema.virtual("age").get(function(){
    const today = new Date()
    const dob = this.dob
    let age = today.getFullYear - dob.getFullYear()

    if(today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()){

        age--
    }
else{

    return age;
}
})
export const User = mongoose.model("User", schema)



