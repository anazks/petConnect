const mongoose = require("mongoose");



const ConsultantSchema = new mongoose.Schema({
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
        default: "not approved"
    }
})



module.exports = mongoose.model("consultant", ConsultantSchema);