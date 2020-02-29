const Client = require('../models/client.model.js');
const nodemailer = require('../nodemailer/index');

// Login a user with the specified userId in the request
exports.login = async (req, res) => {
    try {
        const clientEmail = await Client.findOne({email: req.body.email})
        if(!clientEmail) return res.send({noExistEmail: true})

        const client = await Client.findOne({...req.body}, {psw:0})
        if(!client) return res.send({noCorrectPsw: true})

        req.session.clientId = client._id

        res.send({
            client,
            token: req.session.id
        })
    } catch (err) {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.body.email
            });                
        }
        return res.status(500).send({
            message: "Could not delete User with id " + req.body.email
        });
    }
};

// logged a user with the specified userId in the request
exports.logged = async (req, res) => {
    try {
        if(req.body.token === req.session.id) {
            const client = await Client.findOne(
                {_id: req.session.clientId}, {psw:0}
            )
    
            res.send(client)
        } else res.status(404).send({
            message: "User not found with id " + req.body.email
        })
        
    } catch (err) {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.body.email
            });                
        }
        return res.status(500).send({
            message: "Could not delete User with id " + req.body.email
        });
    }
};

exports.logout = async (req, res) => {
    

    try {
        if(req.body.token === req.session.id) {
            req.session.destroy(err => {
                console.error('logout',err)
            })   
            res.send({logout: true})
        } else res.status(404).send({
            message: "User not found with id " + req.body.token
        })
        
    } catch (err) {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.body.token
            });                
        }
        return res.status(500).send({
            message: "Could not delete User with id " + req.body.token
        });
    }
};

exports.create = async (req, res) => {
  const clientModel = new Client({
      ...req.body,
      confirmCode: Math.random().toString().substr(-5),
      created: Date.now(),
      status: 'unconfirmed'
    })

    try {
        const emailIsExist = await Client.findOne({email: req.body.email})
        if(emailIsExist) {
            res.send({emailIsExist: true});
        }
        else {
            const client = await clientModel.save()
            req.body.msg.template.code = client.confirmCode
            nodemailer.send(req.body.msg)
            res.send({ confirmCode: client.confirmCode });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    };
};

// Retrieve and return all cities from the database.
exports.findAll = (req, res) => {
    console.log("LOG: exports.findAll -> locations", req.query)

  Client.find()
    .limit(10)
  .then(clients => {
      res.send(clients);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving words."
      });
  });
};

// Find a single location with a userId
exports.findOne = (req, res) => {
  Client.findById( req.params.id )
  .then(client => {
      if(!client) {
          return res.status(404).send({
              message: "User not found with id " + req.params.id
          });            
      }
      res.send(client);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "User not found with id " + req.params.id
          });                
      }
      return res.status(500).send({
          message: "Error retrieving user with id " + req.params.id
      });
  });
};

// Update a location identified by the usereId in the request
exports.update = async (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    try {

        const client = await Client.findByIdAndUpdate(
            req.params.id, 
            { ...req.body.content },
            {new: true}
        )

        res.send(client);
        
    } catch (err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.body.query
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.body.query
      });
  };
};
exports.recovery = async (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    try {

        if (req.body.content.recoveryPsw) {
            delete req.body.content.recoveryPsw
            const result = await Client.update(req.body.query, { psw: req.body.content.psw })            
            req.body.msg.template.psw = req.body.content.psw
            nodemailer.send(req.body.msg)
            res.send(result);
        } else {
            console.log("LOG: else", req.body.content)
            const client = await Client.findOneAndUpdate(req.body.query, {...req.body.content})
            req.session.clientId = client._id
            res.send({
                client,
                token: req.session.id
            });
        }
        
    } catch (err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.body.query
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.body.query
      });
  };
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  Client.findByIdAndRemove(req.params.id)
  .then(client => {
      if(!client) {
          return res.status(404).send({
              message: "User not found with id " + req.params.id
          });
      }
      res.send({message: "User deleted successfully!"});
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