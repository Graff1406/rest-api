const Order = require('../models/order.model.js');
const User = require('../models/user.model.js');
const nodemailer = require('../nodemailer/index');

exports.create = async (req, res) => {
  const order = new Order({
      ...req.body,
      created: Date.now(),
      status: 'pending'
      // messages: [{...req.body.messages, createdDate: Date.now()}]
    })
  // console.log("LOG: exports.create -> order", order)

  try {
    console.log('req.body', req.body)
    const orders = await Order.find({ clientId: req.body.clientId })
    const orderIsExist = orders.some(item => {
      // check if order were created in same day for same guide
      const created = new Date(item.created)
      const createdDate = `${created.getDay()}.${created.getMonth()}.${created.getFullYear()}`
      const current = new Date()
      const currentDate = `${current.getDay()}.${current.getMonth()}.${current.getFullYear()}`
      if (createdDate !== currentDate && item.gudeId !== order.gudeId) true
      else false
    })

    if (orderIsExist) res.status(401).send({orderIsExist: true})
    await order.save()
    res.status(201).send({newOrderCreated: true})
    // const user = await User.findById(req.body.gudeId)
    // if (!user) return res.status(404).send({
    //       message: "findById not found with id " + req.body.gudeId
    //   })
    // const calendar = user.services.find( 
    //   service => service._id.toString() === req.body.serviceId.toString()
    // ).calendar

    // if(calendar.includes(req.body.booked))
    //   calendar.splice(i, 1)
    // else calendar.push(req.body.booked)

    // User.update(
    //   { _id: req.body.gudeId, "services._id": req.body.serviceId },
    //   { $set: {"services.$.calendar": calendar} },
    //   (u) =>  console.log('calendar', u)
    // )
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Order."
    })
  }
};

// Retrieve and return all cities from the database.
exports.findAll = async (req, res) => {
  try {
    const orders = await Order.find({_id: req.query._id}).limit(10)
    res.send(orders)
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving words."
    })
  }
}

// Find a single location with a userId
exports.findOne = async (req, res) => {
  try {
    const orders = await Order.findById(req.query._id).limit(10)
    res.send(orders)
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving words."
    })
  }
};

// Update a location identified by the usereId in the request
exports.update = async (req, res) => {
  // Validate Request
  if(!req.body) {
    return res.status(400).send({
      message: "Order content can not be empty"
    });
  }
  console.log("LOG: req.body.status", req.body)
  try {
    const order = await Order.update({_id: req.body._id}, req.body)
    if (order.status === 'refused') nodemailer.send(req.body.msg)
    res.send(order)
  } catch (err) {
    if(err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "Order not found with id " + req.body.query
      })               
    }
    return res.status(500).send({
      message: "Error updating Order with id " + req.body.query
    })
  }
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  Order.findByIdAndRemove(req.params.id)
  .then(dataOrder => {
      if(!dataOrder) {
          return res.status(404).send({
              message: "OrderOrder not found with id " + req.params.id
          });
      }
      res.send({message: "OrderOrder deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "OrderOrder not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Could not delete OrderOrder with id " + req.params.id
      });
  });
};