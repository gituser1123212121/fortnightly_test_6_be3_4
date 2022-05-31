const User = require("../models").user;
const Message = require("../models").message;
const { Op } = require("sequelize");
const Group = require("../models").group;

// create a new message object, that represents a message from one
// user to the other
const sendMessageToSingleUser = async (req, res, next) => {
  // the receiver
  // the sender
  // the message
  // isGroupMessage: false
  const chatObj = {
    userId: req.body.userId,
    senderUserId: req.body.senderUserId,
    message: req.body.message,
    isGroupMessage: false,
    sentOn: Date.now(),
  };
  // verify if both users are valid
  // create two
  let sender = null,
    receiver = null;
  // check if the sender exists in our database
  // Op.eq
  // make sure both values are found from database
  await User.findOne({
    where: {
      userId: {
        [Op.eq]: chatObj.senderUserId,
      },
    },
  }).then((_sender) => {
    // _sender -> response from database
    // sender is our variable
    sender = _sender;
  });
  // check if the receiver exists in our database
  await User.findOne({
    where: {
      userId: {
        [Op.eq]: chatObj.userId,
      },
    },
  }).then((_receiver) => {
    receiver = _receiver;
  });

  if (sender && receiver) {
    // users are valid
    // message can be sent
    // create a row in your database
    await Message.create(chatObj)
      .then((msg) => {
        res.status(200).json({ message: `message sent successfully` });
      })
      .catch((err) => {
        res.status(500).json({
          message: `internal server error: ${err}`,
        });
      });
  } else {
    res
      .status(404)
      .json({ message: "either receiver or sender does not exist" });
  }
};

// get all the messages sent from one user to the other
const getMessagesFromSpecificUser = async (req, res, next) => {
  const userId = req.params.userId;
  const senderUserId = req.params.senderUserId;
  // wait for this operation to complete
  await Message.findAll({
    where: {
      userId: { [Op.eq]: userId },
      senderUserId: { [Op.eq]: senderUserId },
      isGroupMessage: { [Op.eq]: false },
    },
  })
    .then((msgs) => {
      // send only the senderUserId and actual message body
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

// create a new message object that represents a group message
const sendMessageToGroup = async (req, res, next) => {
  // create Message and GroupMessage instance
  //  "userId": 1,
  // "senderUserId": 2,
  // user 2 is sending to group 1
  const groupChatObj = {
    userId: req.body.userId,
    senderUserId: req.body.senderUserId,
    isGroupMessage: true,
    message: req.body.message,
    sentOn: Date.now(),
  };

  // check to make sure group exists
  await Group.findOne({
    where: { groupId: { [Op.eq]: groupChatObj.userId } },
  }).then((group) => {
    if (group) {
      // if group exists then create a new message object
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

// get all the messages from a group that the user is a part of
const getMessagesFromGroup = async (req, res, next) => {
  const userId = req.params.userId;
  const groupId = req.params.groupId;

  // find all messages from the Message model where isGroupMessage is true
  // check to see if user is part of the group
  Group.findOne({
    where: { userId: { [Op.eq]: userId }, groupId: { [Op.eq]: groupId } },
  }).then((userGroupFound) => {
    if (userGroupFound) {
      // if user is a part of specific froup, send the message
      Message.findAll({
        where: {
          userId: { [Op.eq]: groupId },
          isGroupMessage: { [Op.eq]: true },
        },
      }).then((groupMsgs) => {
        // format the messages to send only groupId, and actual message
        let formattedGroupMessages = [];
        groupMsgs.forEach((msg, idx) => {
          formattedGroupMessages.push({
            groupId: groupId,
            messageBody: msg.message,
          });
        });
        // send the group messages as JSON
        res.status(200).send({
          message: `group messages fetched successfully`,
          grpMessages: formattedGroupMessages,
        });
      });
    } else {
      res
        .status(404)
        .json({ message: `user is not a part of specified group` });
    }
  });
};

module.exports = {
  sendMessageToSingleUser,
  getMessagesFromSpecificUser,
  sendMessageToGroup,
  getMessagesFromGroup,
};
