const mongoose = require('mongoose');

const dbCities = {
  city: String
}

const CitySchema = mongoose.Schema(dbCities);

module.exports = mongoose.model('Citie', CitySchema);