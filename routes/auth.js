const express = require("express");

const {
  loginUser,
  registerUser,
  getAllUsers,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/users/all", getAllUsers);

module.exports = router;
