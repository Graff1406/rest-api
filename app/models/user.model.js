const mongoose = require('mongoose');

const dbProf = {
  created: Number,
  status: String,
  confirmCode: Number,
  name: String,
  surName: String,
  email: String,
  psw: String,
  country: String,
  city: String,
  address: String,
  drivingExperience: mongoose.Schema.Types.Mixed,
  excursionExperience: Number,
  avatar: [
    { src: String }
  ],
  idDocs: [
    { src: String }
  ],
  tel: [
    { number: Number | String }
  ],
  lang: [
    { code: String, label: String }
  ],
  car: {
    bodystyle: String,
    brand: String,
    seat: mongoose.Schema.Types.Mixed,
    pics: [
      { src: String }
    ]
  },
  services: [
    {
      created: Number,
      status: String,
      title: {
        ru: String,
        en: String
      },
      description: Object,
      rating: Number,
      price: mongoose.Schema.Types.Mixed,
      locations: {
        ru: Array,
        en: Array
      },
      orders: Array,
      // orders: [{
      //   clientId: String,
      //   status: String,
      //   created: Number,
      //   start: Number,
      //   rejectionReason: String,
      //   messages: [
      //     {
      //       name: String,
      //       text: String,
      //       createdDate: Number, // will be set milliseconds of date
      //       touchedDate: Number // will be set milliseconds of date
      //     }
      //   ]
      // }],
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
        pause: mongoose.Schema.Types.Mixed,
        lunchPause: mongoose.Schema.Types.Mixed
      },
      calendar: {
        saturday: Boolean,
        sunday: Boolean,
        dates: Array
      }
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
      createdDate: Number,
      touchedDate: Number
    }
  ]
}

const UserSchema = mongoose.Schema(dbProf);

module.exports = mongoose.model('User', UserSchema);