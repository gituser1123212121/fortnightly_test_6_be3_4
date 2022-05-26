const User = require("../models").user;
const { hashSync, compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = (req, res, next) => {
  const userObj = {
    username: req.body.username,
    email: req.body.email,
    password: hashSync(req.body.password),
  };
  User.findOne({ email: userObj.email })
    .then((user) => {
      if (!user) {
        User.create(userObj).then(() => {
          res.status(200).json({
            message: `user with email ${userObj.email} successfully registered`,
          });
        });
      } else {
        res
          .status(201)
          .json({ message: `user with email ${userObj.email} already exists` });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: `internal server error: ${err}` });
    });
};

const loginUser = async (req, res, next) => {
  const loginObj = { email: req.body.email, password: req.body.password };
  User.findOne({ email: loginObj.email }).then((user) => {
    if (user) {
      // user exists
      // check for password
      console.log(compareSync(loginObj.password, user.password));
      if (compareSync(loginObj.password, user.password)) {
        let token = jwt.sign({ userId: user.userId }, "mysecretkey");
        // login success
        res.status(200).json({
          message: `login success for ${loginObj.email}`,
          token: token,
        });
      } else {
        res.status(400).json({ message: `invalid credentials for user` });
      }
    } else {
      res
        .status(404)
        .json({ message: `user does not exist, please register first` });
    }
  });
};

const getAllUsers = async (req, res, next) => {
  await User.findAll().then((users) => {
    let formattedUsers = [];
    users.forEach((user, idx) => {
      formattedUsers.push({
        userId: user.userId,
        username: user.username,
      });
    });
    res
      .status(200)
      .json({ message: "users fetched successfully", users: formattedUsers });
  });
};

module.exports = {
  loginUser,
  registerUser,
  getAllUsers,
};
