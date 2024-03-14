import mongoose from 'mongoose'

const schema = mongoose.Schema({
   
    name: {
        type: String,
        required: [true, 'Please enter Name'],
    },
    
    photo: {
        type: String,
        required: [true, 'Please add Photo'],
    },
    price: {
        type: String,
        required: [true, 'Please add Price'],
    },
    stock: {
        type: Number,
        required: [true, 'Please add Stock'],
    },
    category: {
        type: String,
        required: [true, 'Please add Category'],
        trime: true,
    },
   
}, 
{
 timestamps: true,
})

export const Product = mongoose.model("Product", schema)



