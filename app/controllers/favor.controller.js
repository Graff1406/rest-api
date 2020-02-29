const Client = require('../models/client.model.js');
// const User = require('../models/user.model.js');

// Update a location identified by the usereId in the request
exports.update = (req, res) => {
  // console.log("LOG: req.body.status", req.body.content)
  // Validate Request
  if(!req.body.content) {
      return res.status(400).send({
          message: "User content can not be empty"
      });
  }

    // update list of favors 
    Client.findById(req.params.id)
    .then(clientChecked => {
      const gude = req.body.content
      const favorIndex = clientChecked.favors.findIndex(
        item => item._id === gude._id && item.service._id === gude.service._id
      )
    
      if (favorIndex !== -1) clientChecked.favors.splice(favorIndex, 1)
      else clientChecked.favors.push(gude)
      Client.findByIdAndUpdate(
          req.params.id, 
          clientChecked, 
          {new: true},
          () => res.send(clientChecked)
        )
     
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete User with id " + req.params.id
        });
    });
};