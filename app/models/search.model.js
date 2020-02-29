const mongoose = require('mongoose');

const dbKeyWord = {
  word: String
}

const KeyWord = mongoose.Schema(dbKeyWord);

module.exports = mongoose.model('Word', KeyWord);