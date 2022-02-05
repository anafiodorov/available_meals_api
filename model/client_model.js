const { pool } = require('../db.config');

const addClient = (body) => {
  return new Promise(function (resolve, reject) {
    const { fullName, email, password, city, street, postalCode } = body;
    console.log(body);
    pool.query(
      'INSERT INTO clients (name,email,password,city,street,postalcode) VALUES ($1,$2,$3,$4,$5,$6) RETURNING clientid',
      [fullName, email, password, city, street, postalCode],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results) {
          console.log(`${results.rows[0]['clientid']}`);
          resolve(`${results.rows[0]['clientid']}`);
        }
      }
    );
  });
};

const getUserbyEmail = (body) => {
  return new Promise(function (resolve, reject) {
    const { email } = body;
    pool.query(
      'SELECT * FROM clients WHERE email = ($1)',
      [email],
      (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        if (results === null) {
          resolve({});
        } else {
          console.log('Rezultat login ' + results.rows.length);
          resolve(results.rows[0]);
        }
      }
    );
  });
};

module.exports = {
  addClient,
  getUserbyEmail,
};
