const User = require("../models").user;
const { hashSync, compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

/**
 * hashSync("12345678") = hashes to different values
 */

// register a new user if not already registered
const registerUser = async (req, res, next) => {
  const userObj = {
    username: req.body.username,
    email: req.body.email,
    password: hashSync(req.body.password),
  };
  // if the user is registered
  // Op.eq is checking is there is same email in db
  // It checks for equality
  await User.findOne({ where: { email: { [Op.eq]: userObj.email } } })
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

// login a user and provide the token if  credentials are correct
const loginUser = async (req, res, next) => {
  const loginObj = { email: req.body.email, password: req.body.password };
  // find if the user is registered with us
  await User.findOne({
    where: { email: { [Op.eq]: loginObj.email } },
  }).then((user) => {
    // if the user is registered
    if (user) {
      // check for password
      // user exists
      // check for password
      // plain text                        // hashed passwrd
      if (compareSync(loginObj.password, user.password)) {
        // login success
        // sign the token using userId
        let token = jwt.sign({ userId: user.userId }, "mysecretkey");
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

// send info about all users
const getAllUsers = async (req, res, next) => {
  await User.findAll().then((users) => {
    // array to return with JSON data
    let formattedUsers = [];
    // for each user, extract the username and userId
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
  // some other code
};

module.exports = {
  loginUser,
  registerUser,
  getAllUsers,
};
