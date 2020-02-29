const User = require('../models/user.model.js');
const City = require('../models/city.model.js');
const Word = require('../models/search.model.js');

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    // if(!req.body.content) {
    //     return res.status(400).send({
    //         message: "User content can not be empty"
    //     });
    // }

    // Create a User
    const user = new User({
            created: Date.now(),
            status: req.body.status,
            name: req.body.name,
            surName: req.body.surName,
            email: req.body.email,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            avatar: req.body.avatar,
            tel: req.body.tel,
            idDocs: req.body.idDocs,
            experience: req.body.experience,
            profession: ( () => {
                const profession = {}
                for(const prop in req.body.profession) {
                    profession[prop] =  req.body.profession[prop]
                }
                return profession
            } )(),
            services: ( () => req.body.services.map(item => item) )(),
            messangers: ( () => req.body.messangers.map(item => item) )(),
            notifications: ( () => req.body.notifications.map(item => item) )(),
            comments: ( () => req.body.comments.map(item => item) )(),
            favors: ( () => req.body.favors.map(item => item) )()
    });

    // create a city
    const city = new City({
        city: req.body.city
    })

    const servicesTitle = [
        req.body.profession.title,
        ...req.body.services.map( item => item.title)
    ]

    servicesTitle.forEach(word => {
    // console.log("LOG: exports.create -> word", word)
        // create a word
        const keyWord = new Word({
            word
        })
        Word.findOne({ word })
        .then(listWords => {
        // console.log("LOG: exports.create -> listWords", listWords)
            if(!listWords) {
                // Save City in the database
                keyWord.save()
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the User."
                    });
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
    });
    
    City.findOne({ city: req.body.city })
    .limit(1)
    .then(cities => {
    // console.log("LOG: exports.create -> cities", cities)
        if(!cities) {
            // Save City in the database
            city.save()
            .then(data => {
                // res.send(data);
                // console.log('The city is save')
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });

    // Save User in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    
    const query = { 
        $or: [
            { 'profession.title': req.query.search, 'services.orders.booked': {$not: {$eq: Number(req.query.date)}} },
            { 'services.title': req.query.search, 'services.orders.booked': {$not: {$eq: Number(req.query.date)}} }
        ]
    }

    // if (req.query.date)
    //     query['$ne'] = [ {'orders.booked': Number(req.query.date)} ]

    if (req.query.city)
        query.city = req.query.city
    
    let sort

    if (req.query.sort === 'latest')  sort = { created: -1 }
    else if (req.query.sort === 'comments')  sort = { comments: -1 }
    else if (req.query.sort === 'priceAsc')  sort = { price: 1 }
    else if (req.query.sort === 'priceDesc')  sort = { price: -1 }
    else sort = { 'profession.rating': -1 }

    const skip = req.query.offset ? Number(req.query.offset) : 0

    console.log("LOG: query", query)
    User.aggregate([
        { $match: query },
        { $sort: sort },
        { $skip: skip },
        { $limit: 3 /* In the frontend had set limit in components: MyTileProfile, line - 216;  */ }
    ])
    .then(users => {
        User.find(query)
            .count( (err, count) => {
                if (err) {
                    console.log(err)
                }
                const data = {
                    users,
                    quantity: count || null
                }
                res.send(data);
            })        
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        res.send(users);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

// Update a user identified by the usereId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
        title: req.body.title || "Untitled user",
        content: req.body.content
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.userId
        });
    });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete User with id " + req.params.userId
        });
    });
};
