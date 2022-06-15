const express = require('express');
const app = express();
const port = 3001;
const meal_model = require('./model/meal_model');
const order_model = require('./model/order_model');
const client_model = require('./model/client_model');
const bcrypt = require('bcryptjs');
const config = require('./auth.config.js');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./auth.jwt.js');
var https = require('https');

app.get('/hello', (req, res) => {
  res.status(200).send('Hello World!');
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.use(express.json());

app.use(function (req, res, next) {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://availablemeals-app.onrender.com',
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers, Authorization'
  );
  next();
});

app.get('/meals', (req, res) => {
  meal_model
    .getAvailableMeals()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

app.post('/signup', (req, res) => {
  console.log('reqBody' + req);
  client_model
    .addClient({
      fullName: req.body.fullName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      city: req.body.city,
      street: req.body.street,
      postalCode: req.body.postalCode,
    })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post('/login', (req, res) => {
  client_model
    .getUserbyEmail({
      email: req.body.email,
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }

      var token = jwt.sign({ id: user.clientid }, config.secret, {
        expiresIn: 20, // 24 hours
      });
      res.status(200).send({
        id: user.clientid,
        name: user.name,
        street: user.street,
        postalCode: user.postalcode,
        city: user.city,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});

app.post('/orders', verifyToken, (req, res) => {
  console.log('reqBody order' + req);
  order_model
    .addOrder(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
setInterval(function () {
  console.log('set interval availablemeals');
  https.get('https://availablemeals-app.onrender.com');
  https.get('https://availablemeals-api.onrender.com/hello');
}, 1000 * 60 * 13); // every 13 minutes
