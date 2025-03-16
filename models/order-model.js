const mongoose = require("mongoose");



const OrderSchema = new mongoose.Schema({
    productId: String,
    productName: String,
    sellerId: String,
    sellerName: String,
    buyerId: String,
    buyerName: String,
    buyerPhone: String,
    buyerEmail: String,
    date: String,
    status: {
        type: String,
        default: "ordered"
    },
    quantity: String,
    totalPrice: String
})



module.exports = mongoose.model("order", OrderSchema);