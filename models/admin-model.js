const mongoose = require("mongoose");



const AdminSchema = new mongoose.Schema({
    userId: String,
    password: String
})



module.exports = mongoose.model("admin", AdminSchema);