const Langauges = require('../models/langauges.model.js');

exports.create = async (req, res) => {
  const langauges = new Langauges({
    code: req.body.code,
    label: req.body.label
  })

  try {
    const data = await langauges.save()
    res.send(data)
  } catch (err) {
    console.log('languges.controller.create', err)
    res.status(500).send({
        message: err.message || "Some error occurred while creating the languges."
    })
  }
}

// Retrieve and return all cities from the database.
exports.findAll = async (req, res) => {
    try {
      const langauges = await Langauges.find()
      res.send(langauges)
    } catch (err) {
      console.log('languges.controller.findAll', err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving languges."
      })
    }
};

// Find a single location with a userId
exports.findOne = async (req, res) => {
  try {
    const langauges = await Langauges.findById(req.params.id)
    if (!langauges) {
      return res.status(404).send({
        message: "languges not found with id " + req.params.id
      })
    }
    res.send(langauges)
  } catch (err) {
    console.log('languges.controller.findOne', err)
    if(err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "languges not found with id " + req.params.id
      })                
    }
    return res.status(500).send({
      message: "Error retrieving languges with id " + req.params.id
    })
  }
};

// Update a location identified by the usereId in the request
exports.update = async (req, res) => {
  if(!req.body.content) {
    return res.status(400).send({
      message: "User content can not be empty"
    })
  }
  try {
    const langauges = await Langauges.findByIdAndUpdate(
      req.params.id, req.body, {new: true}
    )
    if (!langauges) {
      return res.status(404).send({
        message: "languges not found with id " + req.params.id
      })
    }
    res.send(langauges)
  } catch (err) {
    console.log('languges.controller.update', err)
    if(err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "languges not found with id " + req.params.id
      })                
    }
    return res.status(500).send({
      message: "Error retrieving languges with id " + req.params.id
    })
  }
};

// Delete a user with the specified userId in the request
exports.delete = async (req, res) => {
  try {
    const langauges = await Langauges.findByIdAndRemove(req.params.id)
    if (!langauges) {
      return res.status(404).send({
        message: "languges not found with id " + req.params.id
      })
    }
    res.send({message: "User deleted successfully!"})
  } catch (err) {
    console.log('languges.controller.delete', err)
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
        message: "User not found with id " + req.params.id
      });               
    }
    return res.status(500).send({
      message: "Could not delete User with id " + req.params.id
    })
  }
};