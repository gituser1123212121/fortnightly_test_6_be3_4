const Group = require("../models").group;
const User = require("../models").user;
const { Op } = require("sequelize");

// create a new group row
const createGroup = async (req, res, next) => {
  try {
    // check for users (valid users) can be added
    let usersList = req.body.users;
    let groupId = req.body.groupId;
    // for each user do the following
    /**
     * for(let i=0; i<usersList.length; i++){
     *   Group.findOne({
        where: {
          userId: { [Op.eq]: usersList[i].userId },
          groupId: { [Op.eq]: groupId },
        },
      }).
     * 
     * }
     * 
     * findOne -> returns an object
     * 1 A 
     * 1 B
     * 1 C
     * 
     * findAll -> returns an array
     * 
     * 
     */
    usersList.forEach((user) => {
      // this loop will ruin for each user
      // verifying that the user-group combination does not exist
      Group.findOne({
        where: {
          userId: { [Op.eq]: user.userId },
          groupId: { [Op.eq]: groupId },
        },
      }).then((groupFound) => {
        // if the row exists, the groupFound will no tbe null
        // else it will be null
        // groupFound = null
        // !groupFound == !null/!false == true
        if (!groupFound) {
          // add user to group if they are not a part of it
          // or group dosen't exist
          Group.create({ userId: user.userId, groupId: groupId });
          // if you send response here, it will create a problem
          // you will send a response mutiple times
          // user1 -> send
          // user2 -> send
        }
        // if the row already exists it will be ignored
        // groupFound = valid object = {}
        // !groupFound == !true == false
        // if(false) -> inner code does not execute
        // if(true) -> code will execute
      });
    });

    // send success message
    res.status(200).json({ message: `group created successfully` });
  } catch (err) {
    res.status(500).json({ message: `internal server error: ${err}` });
  }
};

module.exports = {
  createGroup,
};
