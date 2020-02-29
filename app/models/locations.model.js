const mongoose = require('mongoose');

const dbLocation = {
  title: {
    ru: String,
    en: String
  },
  description: {
    ru: String,
    en: String
  },
  pics: Array
}

const Location = mongoose.Schema(dbLocation);

module.exports = mongoose.model('Location', Location);