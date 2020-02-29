const City = require('../models/city.model.js');

// Retrieve and return all cities from the database.
exports.findAll = (req, res) => {
  City.find()
  .then(cities => {
      res.send(cities);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving users."
      });
  });
};