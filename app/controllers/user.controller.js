const User = require('../models/user.model.js');
const Client = require('../models/client.model.js');
const City = require('../models/city.model.js');
const Word = require('../models/search.model.js');
const Orders = require('../models/order.model.js');
const nodemailer = require('../nodemailer/index');

const buildGuide = async guide => {
    // find orders of guide if there is exist for him
    const orders = await Orders.find({gudeId: guide._id})

    // marge orders to services of guide
    // to extract client ids from orders and return
    const clientIds = pushOrdersToService(guide.services, orders)

    // get all data of clients for add to order
    clients = await Client.find({_id: {$in:clientIds} })

    // add name and country of client to suitable of order
    clients.forEach(({name, country}) => pushOrdersToService(guide.services, orders, {name, country}))
    
    function pushOrdersToService(services, orders, client) {
        const clientIds = []
        for (const orderItem of orders) {
            const order = JSON.parse(JSON.stringify(orderItem))
            clientIds.push(order.clientId)
            for (const service of services) {
                // order.serviceId type is string
                // service._id type is object
                if (order.serviceId == service._id && client)
                    service.orders.push({...order, ...client})
            }
        }
        return clientIds
    }
    return guide
}

exports.login = async (req, res) => {
    try {
        // ckeck if email is exist
        const guideEmail = await User.findOne({email: req.body.email})
        if(!guideEmail) return res.send({noExistEmail: true})

        // if email is exist then open access
        const guide = await User.findOne({...req.body}, {psw:0})
        if(!guide) return res.send({noCorrectPsw: true})

        const newGuide = await buildGuide(JSON.parse(JSON.stringify(guide)))

        req.session.clientId = guide._id
        res.status(200).send({
            guide: newGuide,
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
    console.log('rq', req.body)
    console.log('session', req.session.clientId)
    try {
        if(req.body.token === req.session.id) {
            const guide = await User.findOne(
                {_id: req.session.clientId}, {psw:0}
            )
            const newGuide = await buildGuide(JSON.parse(JSON.stringify(guide)))
            res.status(200).send(newGuide)
        } else {
            res.status(404).send({
                message: `User not found with id ${req.session.clientId}`
            })
        }
        
    } catch (err) {
        return res.status(500).send({
            message: "Could not delete User with id " + req.body.email
        });
    }
};

// Join and Save a new User
exports.join = async (req, res) => {

    const emailIsExist = await User.findOne({email: req.body.email})
    if (emailIsExist) {
        res.send({emailIsExist: true})
        return
    }
    // Create a User
    const user = new User({
        created: Date.now(),
        confirmCode: Math.random().toString().substr(-5),
        status: 'inactive',
        country: 'Georgia',
        name: req.body.name,
        surName: req.body.surName,
        email: req.body.email,
        psw: req.body.psw,
        city: req.body.city,
        tel: req.body.tel,
    });

    try {
        const data = await user.save()
        req.body.msg.template.code = data.confirmCode
        console.log("LOG: exports.join -> req.body.msg", req.body.msg)
        nodemailer.send(req.body.msg)
        res.send({ confirmCode: data.confirmCode, id: data.id });
    } catch(err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    }
};

// Recovery psw
exports.recoveryPsw = async (req, res) => {
    console.log("LOG: exports.recoveryPsw -> req", req.body)
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Find user and update it with the request body
    try {
        const user = await User.update(
            { email: req.body.email }, 
            { psw: req.body.psw }
        )
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        req.body.msg.template.psw = req.body.psw
        nodemailer.send(req.body.msg)
        res.send(user);
    } catch(err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    }
}

// Create and Save a new User
exports.create = (req, res) => {
    // Create a User
    const user = new User({
            created: Date.now(),
            status: req.body.status,
            name: req.body.name,
            surName: req.body.surName,
            email: req.body.email,
            psw: req.body.psw,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            avatar: req.body.avatar,
            tel: req.body.tel,
            idDocs: req.body.idDocs,
            excursionExperience: req.body.excursionExperience,
            drivingExperience: req.body.drivingExperience,
            lang: req.body.lang,
            car: { ...req.body.car },
            services: ( () => req.body.services.map(item => item) )(),
            messangers: ( () => req.body.messangers.map(item => item) )(),
            notifications: ( () => req.body.notifications.map(item => item) )(),
            // comments: ( () => req.body.comments.map(item => item) )(),
            // favors: ( () => req.body.favors.map(item => item) )()
    });

    // create a city
    const city = new City({
        city: req.body.city
    })
    
    if (!Array.prototype.flat) {
        Object.defineProperty(Array.prototype, 'flat', {
            value: function(depth = 1) {
            return this.reduce(function (flat, toFlatten) {
                return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
            }, []);
            }
        });
    }

    let data = []
    const filter = item => {
        if(!data.includes(item)){
            data.push(item)
            return item.trim()
        } 
        return false
    }
    const title = req.body.services
        .map( item => Object.values(item.title) )
        .flat()
        .filter(item => filter(item))

    const locations = req.body.services
        .map( item => Object.values(item.locations))
        .flat(3)
        .filter(item => filter(item))

    title.concat(locations).forEach(async word => {
        try {
            const chackWord = await Word.findOne({ word })
            if(!chackWord) new Word({ word }).save()
        } catch (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        }
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
exports.findAll = async (req, res) => {
    
    const query = {}

    if(req.query.search) { 
        query['$or'] = [
            { 
                '$or': [
                    { 'services.title.ru': req.query.search }, 
                    { 'services.title.en': req.query.search }
                ], 
                'services.orders.booked': {$not: {$eq: Number(req.query.date)}} 
            },
            { 
                '$or': [
                    { 'services.locations.ru': { $in: [req.query.search] } }, 
                    { 'services.locations.en': { $in: [req.query.search] } }
                ], 
                'services.orders.booked': {$not: {$eq: Number(req.query.date)}} 
            },
        ]
    }

    if (req.query.city)
        query.city = req.query.city
    
    let sort

    if (req.query.sort === 'latest')  sort = { 'services.created': -1 }
    else if (req.query.sort === 'comments')  sort = { 'lengthComments': -1 }
    else if (req.query.sort === 'priceAsc')  sort = { 'services.price': 1 }
    else if (req.query.sort === 'priceDesc')  sort = { 'services.price': -1 }
    else sort = { 'services.rating': -1 }

    const skip = req.query.offset ? Number(req.query.offset) : 0

    console.log("LOG: query", sort)
    try {
        const users = await User.aggregate([
            { $match: query },
            { $addFields: { lengthComments: { $size: "$services.comments" } } },
            { $sort: sort },
            { $skip: skip },
            { $limit: 30 /* In the frontend had set limit in components: MyTileProfile, line - 216;  */ }
        ])
        const count = await User.find(query).count()
        res.send({ users, quantity: count || null })

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    }
};

// Find a single user with a userId
exports.findOne = (req, res) => {
    // console.log("LOG: exports.findOne -> req", req.params.id)
    User.findById(req.params.id)
    .then(user => {
    console.log("LOG: exports.findOne -> user", user)
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });            
        }
        res.send(user);
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

// Update a user identified by the usereId in the request
exports.update = async (req, res) => {

    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Find user and update it with the request body
    try {
        console.log("LOG: exports.update -> req.body", req.body)

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        console.log("LOG: exports.update -> req.body", req.body.email)
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        req.session.clientId = user._id
        res.send({
            client: req.body,
            token: req.session.id
        })
    } catch(err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    }
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    console.log("LOG: exports.delete -> req", req)
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        if(!user) {
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
