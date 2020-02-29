const mongoose = require('mongoose');

const dbProf = {
  created: Number,
  status: String,
  name: String,
  surName: String,
  email: String,
  country: String,
  city: String,
  address: String,
  avatar: Array,
  tel: Array,
  idDocs: Array,
  excursionExperience: Number,
  lang: [
    { code: String, label: String }
  ],
  drivingExperience: mongoose.Schema.Types.Mixed,
  car: {
    bodystyle: String,
    brand: String,
    seat: mongoose.Schema.Types.Mixed,
    pics: Array
  },
  services: [
    {
      created: Number,
      title: {
        ru: String,
        en: String
      },
      description: Object,
      rating: Number,
      price: Number,
      locations: {
        ru: Array,
        en: Array
      },
      orders: [{
        gudeId: String,
        serviceId: String,
        clientId: String
      }],
      comments: [
        {
          name: String,
          comment: String,
          created: Number,
          evaluate: Boolean
        }
      ],
      detales: {
        duration: String,
        water: Boolean,
        nutrition: Boolean,
        wifi: Boolean,
        additionSpending: String,
        payment: Boolean,
        pause: Number,
        lunchPause: Number
      },
      calendar: Array
    }
  ],
  messangers: [
    {
      title: String,
      contact: [mongoose.Schema.Types.Mixed]
    }
  ],
  notifications: [
    {
      name: String,
      title: String,
      text: String,
      createdDate: Date,
      touchedDate: Date
    }
  ]
}

const UserSchema = mongoose.Schema(dbProf);

module.exports = mongoose.model('User', UserSchema);