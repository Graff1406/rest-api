const Order = require('../models/order.model.js');
const User = require('../models/user.model.js');

exports.create = (req, res) => {
  const order = new Order({
      ...req.body,
      created: Date.now(),
      status: 'unconfirmed',
      messages: [{...req.body.messages, createdDate: Date.now()}]
    })
  // console.log("LOG: exports.create -> order", order)

    Order.findOne({
      clientId: req.body.clientId, 
      booked: req.body.booked
    })
    .then(dataOrder => {
      if(dataOrder) {
        res.send({orderIsExist: true});
      }
      else {
        User.findById(req.body.gudeId)
        .then(user => {
          if(!user) {
              return res.status(404).send({
                  message: "findById not found with id " + req.body.gudeId
              });            
          }
          const calendar = user.services.find( 
            service => service._id.toString() === req.body.serviceId.toString()
          ).calendar

          if(calendar.includes(req.body.booked))
            calendar.splice(i, 1)
          else calendar.push(req.body.booked)
          // user.services.find( service => console.log('calendar', req.body.serviceId))
          // console.log('calendar', user.services.find( service => service._id.toString() === req.body.serviceId.toString()))
          
          User.update(
            { _id: req.body.gudeId, "services._id": req.body.serviceId },
            { $set: {"services.$.calendar": calendar} },
            (u) =>  console.log('calendar', u)
          )
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Order not found with id " + req.body.gudeId
                });                
            }
            return res.status(500).send({
                message: "Error retrieving Order with id " + req.body.gudeId
            });
        });

        order.save()
        .then(data => {
          res.send(data);
        }).catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while creating the Order."
          });
        });
      }
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Order."
      });
    });
};

// Retrieve and return all cities from the database.
exports.findAll = (req, res) => {
  Order.find(req.query)
  .limit(10)
  .then(orders => {
    res.send(orders);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving words."
    });
  });
};

// Find a single location with a userId
exports.findOne = (req, res) => {
  Order.findById( req.params.id )
  .then(dataOrder => {
      if(!dataOrder) {
          return res.status(404).send({
              message: "Order not found with id " + req.params.id
          });            
      }
      res.send(dataOrder);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Order not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Error retrieving Order with id " + req.params.id
      });
  });
};

// Update a location identified by the usereId in the request
exports.update = (req, res) => {
  // Validate Request
  if(!req.body.content) {
      return res.status(400).send({
          message: "Order content can not be empty"
      });
  }
  console.log("LOG: req.body.status", req.body)

  // Find user and update it with the request body
  Order.update(req.body.query, {...req.body.content})
  .then(dataOrder => {
    if(!req.body.content) {
        return res.status(400).send({
            message: "Order content can not be empty"
        });
    }
      res.send(dataOrder);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Order not found with id " + req.body.query
          });                
      }
      return res.status(500).send({
          message: "Error updating Order with id " + req.body.query
      });
  });
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