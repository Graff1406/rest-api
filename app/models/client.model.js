const mongoose = require('mongoose');

const dbClient = {
  confirmCode: Number,
  status: String,
  created: Number,
  name: String,
  psw: String,
  surName: String,
  email: String,
  country: String,
  avatar: Array,
  tel: Array,
  favors: Array,
  orders: [{
    gudeId: String,
    serviceId: String,
    clientId: String
  }],
  notifications: [{
    name: String,
    title: String,
    text: String,
    createdDate: Number, // will be set milliseconds of date
    touchedDate: mongoose.Schema.Types.Mixed // will be set milliseconds of date
  }]
}

const ClientSchema = mongoose.Schema(dbClient);

module.exports = mongoose.model('Client', ClientSchema);