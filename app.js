const express = require("express");
const db = require("./models");
const bodyParser = require("body-parser");

const app = express();
const dotenv = require("dotenv");
const Message = require("./models").message;
dotenv.config();

//BodyParsing
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const User = require("./models").user;

db.sequelize
  .sync({ force: true })
  .then(() => {
    // make sure we have some user pre-built
    User.create({
      username: "user1",
      email: "user1@yahoo.com",
      password: "12345678",
    }).then((user1) => {
      User.create({
        username: "user2",
        email: "user2@yahoo.com",
        password: "12345678",
      }).then((user2) => {
        console.log(`initial users created`);
        console.log("tables dropped and recreated");
      });
    });

    Message.create({
      userId: 1,
      senderUserId: 2,
      message: "This is from 2 to 1",
      sentOn: Date.now(),
    }).then((msg1) => {
      Message.create({
        userId: 2,
        senderUserId: 1,
        message: "This is from 1 to 2",
        sentOn: Date.now(),
      }).then((msg2) => {
        console.log("initial messages created");
      });
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

//Routes
app.use("/api/chat/v1/ping", require("./routes/ping"));
app.use("/api/chat/v1/auth", require("./routes/auth"));
app.use("/api/chat/v1/msg", require("./routes/chat"));
app.use("/api/chat/v1/grp", require("./routes/group"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("Server has started at port " + PORT));
