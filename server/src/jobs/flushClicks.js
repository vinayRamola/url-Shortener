const redisClient = require("../config/redis");
const URLModel = require("../models/url.model");

async function flushClicks() {
  try {
    const keys = await redisClient.keys("clicks:*");

    for (let key of keys) {
      const count = await redisClient.get(key);
      const code = key.split(":")[1];

      await URLModel.updateOne(
        { urlCode: code },
        { $inc: { clicks: Number(count) } }
      );

      await redisClient.del(key);
    }

    console.log("Clicks flushed to DB");
  } catch (err) {
    console.error("Flush error:", err);
  }
}

setInterval(flushClicks, 5 * 60 * 1000);

module.exports = flushClicks;