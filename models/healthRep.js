const mongoose = require("mongoose");

const healthRep = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("healthRep", healthRep);
