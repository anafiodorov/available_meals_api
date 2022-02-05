const { pool } = require('../db.config');

const addOrder = (body) => {
  return new Promise(function (resolve, reject) {
    console.log(body);
    const { id, street, city, postalCode, orders } = body;
    pool.query(
      'INSERT INTO orders (clientid, delivery_street, delivery_postalcode, delivery_city) VALUES ($1,$2,$3,$4) RETURNING orderid',
      [id, street, postalCode, city],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results) {
          var orderId = parseInt(`${results.rows[0]['orderid']}`);
          console.log('OrderId: ' + `${orderId}`);
          orders.forEach((element) => {
            console.log('elem:' + element);
            pool.query(
              'INSERT INTO orderitems (orderid, mealname, price, amount) VALUES ($1, $2, $3, $4) RETURNING orderitemsid',
              [orderId, element.name, element.price, element.amount],
              (error, results) => {
                if (error) {
                  console.log(error);
                  reject(error);
                }
                if (results) {
                  console.log(
                    'OrderItemId: ' + `${results.rows[0]['orderitemsid']}`
                  );
                }
              }
            );
          });
        }
      }
    );
  });
};

module.exports = {
  addOrder,
};
