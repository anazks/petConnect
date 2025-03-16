const mongoose = require("mongoose");

const LostSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Lost", LostSchema);