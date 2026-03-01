// url.model.js
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    urlCode: {
        type: String,
        required: true,
        unique: true
    },
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("URL", urlSchema);