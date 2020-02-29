const Location = require('../models/locations.model.js');

exports.create = (req, res) => {
  
  const locale = new Location({
    title: req.body.title,
    description: req.body.description,
    pics: req.body.pics
  })

  // Save User in the database
  locale.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the User."
      });
  });
};

// Retrieve and return all cities from the database.
exports.findAll = async (req, res) => {
    // console.log("LOG: exports.findAll -> locations", req.query)

    try {
        const locales = await Location.find({ 
            $or: [
                {'title.ru': { $in: req.query.locations } },
                {'title.en': { $in: req.query.locations } }
            ] 
        })
        console.log("LOG: exports.findAll -> locales", locales)
        res.send(locales)
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving words."
        });
    }
};

// Find a single location with a userId
exports.findOne = (req, res) => {
  Location.findById(req.params.locationId)
  .then(locations => {
      if(!locations) {
          return res.status(404).send({
              message: "User not found with id " + req.params.locationId
          });            
      }
      res.send(Locations);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "User not found with id " + req.params.locationId
          });                
      }
      return res.status(500).send({
          message: "Error retrieving user with id " + req.params.locationId
      });
  });
};

// Update a location identified by the usereId in the request
exports.update = (req, res) => {
  // Validate Request
  if(!req.body.content) {
      return res.status(400).send({
          message: "User content can not be empty"
      });
  }

  // Find user and update it with the request body
  Location.findByIdAndUpdate(req.params.locationId, {
      title: req.body.title || "Untitled user",
      description: req.body.description,
      pics: req.body.pics
  }, {new: true})
  .then(location => {
      if(!location) {
          return res.status(404).send({
              message: "User not found with id " + req.params.locationId
          });
      }
      res.send(location);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "User not found with id " + req.params.locationId
          });                
      }
      return res.status(500).send({
          message: "Error updating user with id " + req.params.locationId
      });
  });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  Location.findByIdAndRemove(req.params.locationId)
  .then(user => {
      if(!user) {
          return res.status(404).send({
              message: "User not found with id " + req.params.locationId
          });
      }
      res.send({message: "User deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "User not found with id " + req.params.locationId
          });                
      }
      return res.status(500).send({
          message: "Could not delete User with id " + req.params.locationId
      });
  });
};