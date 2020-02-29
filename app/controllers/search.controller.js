const Word = require('../models/search.model.js');

// Retrieve and return all cities from the database.
exports.findAll = (req, res) => {
    Word.find({
        word: { 
            $regex: '.*' + req.query.search + '.*',
            $options: 'i'
        } 
    })
  .then(words => {
      res.send(words);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving words."
      });
  });
};