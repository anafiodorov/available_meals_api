const Pool = require('pg').Pool;
require('dotenv').config({ path: './dev.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
pool.on('connect', (client) => {
  client.query(`SET search_path TO availablemeals, public`);
});

pool.on('error', (err) => {
  console.log(err);
  return;
});

module.exports = {
  pool,
};
