const express = require("express");

const {
  sendMessageToSingleUser,
  getMessagesFromSpecificUser,
} = require("../controllers/chatController");
const router = express.Router();

router.post("/send", sendMessageToSingleUser);
router.get(
  "/messages/:userId/sender/:senderUserId",
  getMessagesFromSpecificUser
);

module.exports = router;
