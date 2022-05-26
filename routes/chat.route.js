const express = require("express");

const {
  sendMessageToSingleUser,
  getMessagesFromSpecificUser,
} = require("../controllers/chatController");
const router = express.Router();

const { checkToken } = require("../middlewares");

router.post("/send", [checkToken], sendMessageToSingleUser);
router.get(
  "/messages/:userId/sender/:senderUserId",
  [checkToken],
  getMessagesFromSpecificUser
);

module.exports = router;
