const express = require("express");
const cors = require("cors");
const urlRoutes = require("./routes/url.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hi there" });
});

app.use("/api/url", urlRoutes);

module.exports = app;