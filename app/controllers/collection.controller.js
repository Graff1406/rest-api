const User = require('../models/user.model.js');

// Retrieve and return all cities from the database.
exports.findAll = (req, res) => {
  let [find, sort] = [{}, { 'services.rating': -1 }]
  if (req.query.city) {
    find = { city: req.query.city }
  }

  User.aggregate([
    { $match: find },
    { $sort: sort },
    { $limit: 10 }
  ])
  .then(collections => {
    // console.log("LOG: exports.findAll -> collections", collections)
      res.send(collections);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving words."
      });
  });
};