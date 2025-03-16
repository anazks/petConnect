const mongoose = require("mongoose");



const UserSchema = new mongoose.Schema({
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
        required: true,
        unique: true
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



module.exports = mongoose.model("user", UserSchema);