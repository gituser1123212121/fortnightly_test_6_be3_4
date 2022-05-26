const express = require("express");
const db = require("./models");
const bodyParser = require("body-parser");

const app = express();
const dotenv = require("dotenv");
dotenv.config();

//BodyParsing
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const User = require("./models").user;
const Message = require("./models").message;
const Group = require("./models").group;
const { hashSync } = require("bcryptjs");

db.sequelize
  .sync({ force: true })
  .then(() => {
    // make sure we have some user pre-built
    User.create({
      username: "user1",
      email: "user1@yahoo.com",
      password: hashSync("12345678"),
    }).then((user1) => {
      User.create({
        username: "user2",
        email: "user2@yahoo.com",
        password: hashSync("12345678"),
      }).then((user2) => {
        console.log(`initial users created`);
        console.log("tables dropped and recreated");
      });
    });

    // create single user messages
    Message.create({
      userId: 1,
      senderUserId: 2,
      message: "This is from 2 to 1",
      sentOn: Date.now(),
      isGroupMessage: false,
    }).then((msg1) => {
      Message.create({
        userId: 2,
        senderUserId: 1,
        message: "This is from 1 to 2",
        sentOn: Date.now(),
        isGroupMessage: false,
      }).then((msg2) => {
        console.log("initial messages created");
      });
    });

    // create group messages
    Message.create({
      userId: 1,
      senderUserId: 2,
      message: "This is from 2 to group 1",
      sentOn: Date.now(),
      isGroupMessage: true,
    }).then((grpMsg1) => {
      Message.create({
        userId: 1,
        senderUserId: 1,
        message: "This is from 1 to group 1",
        sentOn: Date.now(),
        isGroupMessage: true,
      }).then((grpMsg2) => {
        console.log(`initial group messages created`);
      });
    });

    Group.create({ userId: 1, groupId: 1 }).then((grp) => {
      console.log("initial group created successfully");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

//Routes
app.use("/api/chat/v1/ping", require("./routes/ping.route"));
app.use("/api/chat/v1/auth", require("./routes/auth.route"));
app.use("/api/chat/v1/msg", require("./routes/chat.route"));
app.use("/api/chat/v1/grp", require("./routes/group.route"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("Server has started at port " + PORT));
