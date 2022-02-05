const { pool } = require('../db.config');

const getAvailableMeals = () => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'SELECT * FROM availablemeals ORDER BY mealid ASC',
      (error, results) => {
        console.log(error);
        if (error) {
          reject(error);
        }
        if (results === null) {
          resolve([]);
        } else {
          resolve(results.rows);
        }
      }
    );
  });
};

module.exports = {
  getAvailableMeals,
};
