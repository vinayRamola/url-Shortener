// src/controllers/url.controller.js
const validUrl = require("valid-url");
const redisClient = require("../config/redis");
const URLModel = require("../models/url.model");

const { getNextSequence, generateSecureCode } = require("../utils");

const baseUrl = process.env.BASEURI;

exports.shortenUrl = async (req, res) => {
  try {
    const { longUrl, urlCode } = req.body;

    if (!validUrl.isUri(longUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // If custom code provided → validate
    let finalCode;

    if (urlCode && urlCode.trim() !== "") {
      // Only allow alphanumeric + - _
      const regex = /^[a-zA-Z0-9_-]+$/;

      if (!regex.test(urlCode)) {
        return res.status(400).json({
          error: "Custom code can only contain letters, numbers, - and _",
        });
      }

      // Check if already taken
      const existingCode = await URLModel.findOne({ urlCode });

      if (existingCode) {
        return res.status(400).json({ error: "Custom code already taken" });
      }

      finalCode = urlCode;
    } else {
      // Auto generate
      const id = await getNextSequence("urlCounter");
      finalCode = generateSecureCode(id);
    }

    const shortUrl = `${process.env.BASEURI}/${finalCode}`;

    const newURL = new URLModel({
      urlCode: finalCode,
      longUrl,
      shortUrl,
      clicks: 0,
    });

    await newURL.save();

    return res.status(201).json({
      shortUrl,
      urlCode: finalCode,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.redirectUrl = async (req, res) => {
  const { code } = req.params;

  try {
    // 1️⃣ Try Redis cache first
    const cachedUrl = await redisClient.get(`url:${code}`);

    if (cachedUrl) {
      try {
        await redisClient.incr(`clicks:${code}`);
      } catch (err) {
        console.log("Redis click increment failed");
      }

      return res.redirect(302, cachedUrl);
    }

    // 2️⃣ If not in cache → fetch from DB
    const url = await URLModel.findOne({ urlCode: code });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // 3️⃣ Check expiry
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({ error: "Link expired" });
    }

    // 4️⃣ Store in Redis cache
    await redisClient.set(`url:${code}`, url.longUrl, {
      EX: 60 * 60 // 1 hour TTL
    });

    // 5️⃣ Increment click counter in Redis
    try {
      await redisClient.incr(`clicks:${code}`);
    } catch (err) {
      // Fallback if Redis fails
      await URLModel.updateOne(
        { urlCode: code },
        { $inc: { clicks: 1 } }
      );
    }

    return res.redirect(302, url.longUrl);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

