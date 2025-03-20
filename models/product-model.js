const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    mrp: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true  
    },
    sellerName: {
        type: String,
        required: true
    },
    relatedTo: {
        type: String,
        required: true
    }, 
    status: {
        type: String,
        default: "approved"
    }
})

module.exports = mongoose.model("product", ProductSchema);