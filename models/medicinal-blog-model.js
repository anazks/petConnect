const mongoose = require("mongoose");

const MedBlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    consultantId: {
        type: String,
        required: true
    },
    consultantName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'not approved'
    }
})

module.exports = mongoose.model("medicinalBlog", MedBlogSchema);