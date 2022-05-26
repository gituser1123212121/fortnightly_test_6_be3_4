const User = require("../models").user;
const Message = require("../models").message;
const { Op } = require("sequelize");

const sendMessageToSingleUser = async (req, res, next) => {
  const chatObj = {
    userId: req.body.userId,
    senderUserId: req.body.senderUserId,
    message: req.body.message,
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
        res.status(200).json(msg);
      })
      .catch((err) => {
        res.status(500).json({ message: `internal server error: ${err}` });
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
    },
  })
    .then((msgs) => {
      console.log(msgs);
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
};

module.exports = {
  sendMessageToSingleUser,
  getMessagesFromSpecificUser,
  sendMessageToGroup,
};
