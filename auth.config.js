require('dotenv').config({ path: './dev.env' });

module.exports = {
  secret: process.env.AUTH_SECRET,
};
