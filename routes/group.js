const express = require("express");
const router = express.Router();

const { createGroup } = require("../controllers/groupController");
const {
  sendMessageToGroup,
  getMessagesFromGroup,
} = require("../controllers/chatController");

router.post("/group", createGroup);
router.post("/group/send", sendMessageToGroup);
router.get("/messages/:userId/group/:groupId", getMessagesFromGroup);
module.exports = router;
