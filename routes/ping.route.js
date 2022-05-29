const express = require("express");
const res = require("express/lib/response");

const router = express.Router();

// API endpoint to check if server is up and running
router.get("/", (req, res, next) => {
  try {
    res.status(200).json({ status: "api is working" });
  } catch (msg) {
    res.status(500).json({ status: "internal server error" });
  }
});

module.exports = router;
