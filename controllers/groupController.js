const Group = require("../models").group;

// create a new group row
const createGroup = async (req, res, next) => {
  try {
    let usersList = req.body.users;
    let groupId = req.body.groupId;
    usersList.forEach((user, idx) => {
      Group.create({ userId: user.userId, groupId: groupId });
    });

    res.status(200).json({ message: `group created successfully` });
  } catch (err) {
    res.status(500).json({ message: `internal server error: ${err.message}` });
  }
};

module.exports = {
  createGroup,
};
