const jwt = require('jsonwebtoken');
const config = require('./auth.config.js');

verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    //split the space at the bearer
    const bearer = bearerHeader.split(' ');
    //Get token from string
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: 'Unauthorized!',
        });
      }
      req.userId = decoded.id;
      next();
    });
  } else {
    //Fobidden
    return res.status(403).send({
      message: 'No token provided!',
    });
  }
};

module.exports = { verifyToken };
