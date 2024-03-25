import mongoose from 'mongoose'

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter Category Name'],
    },
    image: {
        type: String,
        required: [true, 'Please add Category Image'],
    },
}); 


export const Category = mongoose.model("Category", categorySchema);