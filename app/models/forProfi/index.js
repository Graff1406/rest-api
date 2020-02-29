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
  experience: Number,
  profession: {
    title: String,
    description: String,
    rating: Number,
    outJob: Boolean,
    homeJob: Boolean,
    hideTel: Boolean,
    workDays: Array,
    schedule: String,
    bonus: String,
    pics: Array,
    licenses: Array
  },
  services: [
    {
      title: String,
      negotiablePrice: Boolean,
      price: Number,
      currency: String,
      mera: String,
      orders: [
        {
          status: String,
          clientId: String,
          created: Number,
          booked: Number,
          paid: String
        }
      ]
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
      title: String,
      text: String,
      createdDate: Date,
      touchedDate: Date
    }
  ],
  comments: [
    {
      name: String,
      comment: String,
      created: Date,
      evaluate: Boolean
    }
  ],
  favors: [
    {
      _id: String,
      name: String,
      surName: String,
      avatar: String,
      profession: String
    }
  ]
}

const UserSchema = mongoose.Schema(dbProf);

module.exports = mongoose.model('User', UserSchema);