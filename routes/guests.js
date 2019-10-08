let guests = require('../models/guests');
let express = require('express');
let router = express.Router();


router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(guests,null,5));
    // Return a JSON representation of our list
    //res.json(donations);
}

router.addGuest = (req, res) => {
    //Add a new donation to our list
    var id = Math.floor((Math.random() * 1000000) + 1); //Randomly generate an id
    var check = 'waiting';

    var guest = ({"id" : id, "name" : req.body.name, people : req.body.people, "roomno" : req.body.roomno, "breakfast" : req.body.breakfast, "roomtype" : req.body.roomtype, "check" : check});
    //var donation = ({"id" : id, "paymenttype" : req.body.paymenttype, "amount" : req.body.amount, "upvotes" : 0});
    var currentSize = guests.length;

    guests.push(guest);

    if((currentSize + 1) == guests.length)
        res.json({ message: 'Guest Added!'});
    else
        res.json({ message: 'Guest NOT Added!'});
}

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

module.exports = router;