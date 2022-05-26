const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(400).json({ message: `this request is not authorized` });
  } else {
    let decodedToken = jwt.verify(req.headers.authorization, "mysecretkey");
    if (!decodedToken) {
      res.status(400).json({ message: `this token is invalid` });
    } else {
      next();
    }
  }
};

module.exports = {
  checkToken,
};
