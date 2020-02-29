const mongoose = require('mongoose');

const dbOrder = {
  status: String,
  gudeId: String,
  serviceId: String,
  clientId: String,
  created: Number,
  booked: Number,
  paid: String,
  sum: mongoose.Schema.Types.Mixed,
  messages: [
    {
      name: String,
      text: String,
      createdDate: Number, // will be set milliseconds of date
      touchedDate: Number // will be set milliseconds of date
    }
  ]
}

const OrderSchema = mongoose.Schema(dbOrder);

module.exports = mongoose.model('Order', OrderSchema);