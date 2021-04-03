const mongoose = require('mongoose');

const dbOrder = {
  gudeId: String,
  serviceId: String,
  clientId: String,
  status: String,
  created: Number,
  start: Number,
  rejectionReason: String,
  title: Object,
  languages: [
    { code: String, label: String }
  ],
  messages: [
    {
      author: mongoose.Schema.Types.Mixed,
      contents: String,
      touched: Boolean,
      date: {
        day: String,
        time: String,
      }
    }
  ]
}

const OrderSchema = mongoose.Schema(dbOrder);

module.exports = mongoose.model('Order', OrderSchema);