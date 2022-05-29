const jwt = require("jsonwebtoken");

// middleware to check for token in request header
const checkToken = (req, res, next) => {
  // token is not sent
  if (!req.headers.authorization) {
    res.status(400).json({ message: `this request is not authorized` });
  } else {
    // decode the token and check
    let decodedToken = jwt.verify(req.headers.authorization, "mysecretkey");
    // if it is null, return
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
