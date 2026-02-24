// src/controllers/url.controller.js
const validUrl = require("valid-url");
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
  try {
    const { code } = req.params;

    const url = await URLModel.findOne({ urlCode: code });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.longUrl);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
