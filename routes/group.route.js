const express = require("express");
const router = express.Router();

// group related API endpoints
const { createGroup } = require("../controllers/groupController");
const {
  sendMessageToGroup,
  getMessagesFromGroup,
} = require("../controllers/chatController");

const { checkToken } = require("../middlewares");

router.post("/group", [checkToken], createGroup);
router.post("/group/send", [checkToken], sendMessageToGroup);
router.get(
  "/messages/:userId/group/:groupId",
  [checkToken],
  getMessagesFromGroup
);
module.exports = router;
