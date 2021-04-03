const mongoose = require('mongoose');

const dbLangauges = {
  code: String,
  label: String
}

const Langauges = mongoose.Schema(dbLangauges);

module.exports = mongoose.model('Langauges', Langauges);