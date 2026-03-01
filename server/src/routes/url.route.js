// src/routes/url.route.js
const express = require("express");
const router = express.Router();
const { shortenUrl, redirectUrl,getAnalytics , getDashboardStats} = require("../controllers/url.controller");

router.post("/shorten", shortenUrl);
router.get("/dashboard-stats", getDashboardStats);   // ← move up
router.get("/analytics/:code", getAnalytics);        // ← move up
router.get("/:code", redirectUrl);  

module.exports = router;



