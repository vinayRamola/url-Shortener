// src/controllers/url.controller.js
const validUrl = require("valid-url");
const redisClient = require("../config/redis");
const URLModel = require("../models/url.model");
const QRCode = require("qrcode");

const { getNextSequence, generateSecureCode } = require("../utils");

const baseUrl = process.env.BASEURI;

exports.shortenUrl = async (req, res) => {
  try {
    const { longUrl, urlCode } = req.body;

    if (!validUrl.isUri(longUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    let finalCode;

    if (urlCode && urlCode.trim() !== "") {
      const regex = /^[a-zA-Z0-9_-]+$/;

      if (!regex.test(urlCode)) {
        return res.status(400).json({
          error: "Custom code can only contain letters, numbers, - and _",
        });
      }

      const existingCode = await URLModel.findOne({ urlCode });

      if (existingCode) {
        return res.status(400).json({ error: "Custom code already taken" });
      }

      finalCode = urlCode;
    } else {
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

    // ✅ Generate QR code (base64)
    const qrCode = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
    });

    return res.status(201).json({
      shortUrl,
      urlCode: finalCode,
      qrCode,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.redirectUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const cachedUrl = await redisClient.get(`url:${code}`);

    if (cachedUrl) {
      try {
        await redisClient.incr(`clicks:${code}`);
      } catch (err) {
        console.log("Redis click increment failed — falling back to DB");
        await URLModel.updateOne({ urlCode: code }, { $inc: { clicks: 1 } });
      }
      return res.redirect(302, cachedUrl);
    }

    const url = await URLModel.findOne({ urlCode: code });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({ error: "Link expired" });
    }

    await redisClient.set(`url:${code}`, url.longUrl, { EX: 60 * 60 });

    try {
      await redisClient.incr(`clicks:${code}`);
    } catch (err) {
      await URLModel.updateOne({ urlCode: code }, { $inc: { clicks: 1 } });
    }

    return res.redirect(302, url.longUrl);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getAnalytics = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await URLModel.findOne({ urlCode: code });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // ✅ FIX 2: Merge Redis click count (live) with MongoDB click count (persisted)
    // Redis holds increments that haven't been flushed to DB yet
    let redisClicks = 0;
    try {
      const raw = await redisClient.get(`clicks:${code}`);
      redisClicks = raw ? parseInt(raw, 10) : 0;
    } catch (err) {
      console.log("Redis unavailable — using DB clicks only");
    }

    const totalClicks = url.clicks + redisClicks;

    return res.status(200).json({
      urlCode: url.urlCode,
      longUrl: url.longUrl,
      totalClicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt || null,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    // ✅ FIX 1: was `Url` (undefined) — changed to `URLModel`
    const totalLinks = await URLModel.countDocuments();

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const linksLast24Hours = await URLModel.countDocuments({
      createdAt: { $gte: last24Hours },
    });

    const redirectAgg = await URLModel.aggregate([
      {
        $group: {
          _id: null,
          totalRedirects: { $sum: "$clicks" },
        },
      },
    ]);

    const dbRedirects =
      redirectAgg.length > 0 ? redirectAgg[0].totalRedirects : 0;

    // ✅ FIX 2: Also sum live Redis click counters so the dashboard
    //    reflects redirects that haven't been flushed to MongoDB yet
    let redisRedirects = 0;
    try {
      const keys = await redisClient.keys("clicks:*");
      if (keys.length > 0) {
        const values = await redisClient.mGet(keys);
        redisRedirects = values.reduce(
          (sum, v) => sum + (v ? parseInt(v, 10) : 0),
          0
        );
      }
    } catch (err) {
      console.log("Redis unavailable — using DB redirect count only");
    }

    const totalRedirects = dbRedirects + redisRedirects;

    res.json({
      totalLinks,
      linksLast24Hours,
      totalRedirects,
      avgRedirectSpeed: "<50ms",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};