const Counter = require("./models/counter.model");
const crypto = require("crypto");

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";


async function getNextSequence(counterName) {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  return counter.sequence_value;
}


function generateSecureCode(num) {
  let code = "";

  while (num > 0) {
    code = BASE62[num % 62] + code;
    num = Math.floor(num / 62);
  }

  return code.padStart(6, "0");
}

module.exports = {
    getNextSequence,
    generateSecureCode
};