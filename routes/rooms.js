let Rooms = require('../models/rooms');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');


const connectionString = `mongodb+srv://$(process.env.USER):$(process.env.PASS)@cluster0-ikkfh.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(connectionString);

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

router.findEmptyRooms = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Rooms.find({"state":"Ready"},function(err, rooms) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(rooms,null,5));
    });
}

router.roomReady = (req, res) => {

    res.setHeader('content-Type', 'application/json');

    //this is alternative to easier code
    let check = 0;

    Rooms.findById({"_id": req.params.id}, function (err,room) {
       if (err)
           res.send(err);
        else {
          room.state ="Ready";
           room.save(function (err) {
               if (err)
                   res.json({message: 'could not empty room'});
           })
           res.json({message: 'room Ready!'});
       }

    });
}

router.roomMaintain = (req, res) => {

    res.setHeader('content-Type', 'application/json');

    //this is alternative to easier code
    let check = 0;

    Rooms.findById({"_id": req.params.id}, function (err,room) {
        if (err)
            res.send(err);
        else {
            room.state ="Maintain";
            room.save(function (err) {
                if (err)
                    res.json({message: 'could not send for maintain'});
            })
            res.json({message: 'room scheduled for maintenance!'});
        }

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