const Counter = require("./models/counter.model");
const crypto = require("crypto");

async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
        { _id: name },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    return counter.sequence_value;
}

function generateSecureCode(id) {
    return crypto
        .createHash("sha256")
        .update(id.toString() + process.env.SECRET_KEY)
        .digest("base64url")   // URL safe encoding
        .slice(0, 7);          // 7 character short code
}

module.exports = {
    getNextSequence,
    generateSecureCode
};