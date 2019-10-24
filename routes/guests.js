let guests = require('../models/guests');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');



mongoose.connect('mongodb://localhost:27017/hoteldb');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    guests.find(function(err, guests) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(guests,null,5));
    });
}

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    guests.find({"_id": req.params.id}, function (err,guest) {
        if (err)
            res.send(err);
        // return a suitable error message
        else
            res.send(JSON.stringify(guest, null, 5));

        // return the donation
    });
}

router.deleteGuest = (req, res) => {

    guests.findByIdAndRemove({"_id": req.params.id}, function(err) {
        if (err)
            res.json({message:'Guest not deleted!'});
        else
            res.json({message:'Guest deleted!'});
    });
}

router.checkGuestIn = (req, res) => {

    guests.findById({"_id": req.params.id}, function(err,guest) {
        if (err)
            res.json({message:'could not find Guest'});
        else {
            guest.check = "in";
            guest.save(function (err) {
                if (err)
                    res.json({message:'could not check guest in!'});
                else
                    res.json({message:'Guest checked in!'});
            });
        }
    });
}

router.checkGuestOut = (req, res) => {

    guests.findById({"_id": req.params.id}, function(err,guest) {
        if (err)
            res.json({message:'could not find Guest'});
        else {
            guest.check = "out";
            guest.save(function (err) {
                if (err)
                    res.json({message:'could not check guest ouy!'});
                else
                    res.json({message:'Guest checked out!'});
            });
        }
    });
}

// router.findAll = (req, res) => {
//     // Return a JSON representation of our list
//     res.setHeader('Content-Type', 'application/json');
//
//     guests.find(function(err, guests) {
//         if (err)
//             res.send(err);
//
//         res.send(JSON.stringify(guests,null,5));
//     });
// }

router.addGuest = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var guest = new guests();

    guest.name = req.body.name;
    guest.people = req.body.people;
    guest.roomno = req.body.roomno;
    guest.check = "waiting";
    guest.breakfast = req.body.breakfast;
    guest.roomtype = req.body.roomtype;

        guest.save(function(err) {
                if (err)
                res.json({ message: 'Guest not added!' });
                else
                res.json({ message: 'Guest added!' });
            });
}

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

module.exports = router;