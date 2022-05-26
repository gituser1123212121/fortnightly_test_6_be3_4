const User = require("../models").user;
const Message = require("../models").message;
const { Op } = require("sequelize");
const Group = require("../models").group;

const sendMessageToSingleUser = async (req, res, next) => {
  const chatObj = {
    userId: req.body.userId,
    senderUserId: req.body.senderUserId,
    message: req.body.message,
    isGroupMessage: req.body.isGroupMessage,
    sentOn: Date.now(),
  };
  // verify if both users are valid
  let sender = null,
    receiver = null;
  await User.findOne({ userId: chatObj.senderUserId }).then((_sender) => {
    sender = _sender;
  });
  await User.findOne({ userId: chatObj.userId }).then((_receiver) => {
    receiver = _receiver;
  });

  if (sender && receiver) {
    // message can be sent
    Message.create(chatObj)
      .then((msg) => {
        res.status(200).json({ message: `message sent successfully` });
      })
      .catch((err) => {
        res.status(500).json({
          message: `internal server error: ${err}`,
        });
      });
  }
};

const getMessagesFromSpecificUser = async (req, res, next) => {
  const userId = req.params.userId;
  const senderUserId = req.params.senderUserId;
  Message.findAll({
    where: {
      userId: { [Op.eq]: userId },
      senderUserId: { [Op.eq]: senderUserId },
      isGroupMessage: { [Op.eq]: false },
    },
  })
    .then((msgs) => {
      let formattedMessages = [];
      msgs.forEach((msg, idx) => {
        formattedMessages.push({
          userId: msg.userId,
          senderUserId: msg.senderUserId,
          messageBody: msg.message,
        });
      });
      res.status(200).json({
        message: "fetched messages successfully",
        chats: formattedMessages,
      });
    })
    .catch((err) => {
      res.status({ message: `internal server error: ${err}` });
    });
};

const sendMessageToGroup = async (req, res, next) => {
  // create Message and GroupMessage instance
  const groupChatObj = {
    userId: req.body.userId,
    senderUserId: req.body.senderUserId,
    isGroupMessage: req.body.isGroupMessage,
    message: req.body.message,
    sentOn: Date.now(),
  };

  Group.findOne({
    where: { groupId: { [Op.eq]: groupChatObj.userId } },
  }).then((group) => {
    if (group) {
      Message.create(groupChatObj)
        .then((groupMsg) => {
          res
            .status(200)
            .json({ message: `message sent to group successfully` });
        })
        .catch((err) => {
          res.status(500).json({ message: `internal server error: ${err}` });
        });
    } else {
      res
        .status(404)
        .json({ message: `that group does not exist, please create it first` });
    }
  });
};

const getMessagesFromGroup = async (req, res, next) => {
  const userId = req.params.userId;
  const groupId = req.params.groupId;

  Message.findAll({
    where: {
      userId: { [Op.eq]: groupId },
      isGroupMessage: { [Op.eq]: true },
    },
  }).then((groupMsgs) => {
    let formattedGroupMessages = [];
    groupMsgs.forEach((msg, idx) => {
      formattedGroupMessages.push({
        groupId: groupId,
        messageBody: msg.message,
      });
    });
    res.status(200).send({
      message: `group messages fetched successfully`,
      grpMessages: formattedGroupMessages,
    });
  });
};

module.exports = {
  sendMessageToSingleUser,
  getMessagesFromSpecificUser,
  sendMessageToGroup,
  getMessagesFromGroup,
};
