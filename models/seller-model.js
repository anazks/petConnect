const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "approved"
    }
})

module.exports = mongoose.model("seller", SellerSchema);