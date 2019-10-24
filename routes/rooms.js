let Rooms = require('../models/rooms');
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

    Rooms.find(function(err, rooms) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(rooms,null,5));
    });
}

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Rooms.find(function(err, rooms) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(rooms,null,5));
    });
}

router.findEmptyRooms = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Rooms.find({"state":"Ready"},function(err, rooms) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(rooms,null,5));
    });
}

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Rooms.find({"_id": req.params.id}, function (err,room) {
        if (err)
            res.send(err);
        // return a suitable error message
        else
            res.send(JSON.stringify(room, null, 5));

        // return the donation
    });
}

router.deleteRoom = (req, res) => {

    Rooms.findByIdAndRemove({"_id": req.params.id}, function(err) {
        if (err)
            res.json({message:'Room not deleted!'});
        else
            res.json({message:'Room deleted!'});
    });
}


module.exports = router;