let Guests = require('../models/guests');
let Rooms = require('../models/rooms');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
require('dotenv')
    .config();

const connectionString = `$()`

mongoose.connect(`mongodb+srv://$(process.env.USER):BoJack1789@cluster0-ikkfh.mongodb.net/test?retryWrites=true&w=majority`);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.AssignRoom = (req, res) => {
    // Return a JSON representation of our list
    //res.setHeader('Content-Type', 'application/json');

    let guestname;
    let type;
    let check = 0;
    let roomno;

    Guests.findById({"_id": req.params.id}, function (err, guest) {
        if (err)
            res.send(err);
        else {
            //res.json({message: 'found guest'});
            type = guest.roomtype;
            guestname = guest.name;

            Rooms.find({"state": "Ready"}, function (err, rooms) {
                if (err)
                    res.send(err);
                else {
                    //res.json({message: 'found rooms'});
                    rooms.forEach(function (room) {
                        if (check === 0 && room.roomtype === type) {

                            room.state = "Occupied";
                            room.guest = guestname;
                            roomno = room.number;
                            check = 1;
                            room.save(function (err) {
                                if (err)
                                    res.json({message: 'could not occupied room'});
                            })
                            guest.roomno = roomno;
                            guest.check = "in";
                            guest.save(function (err) {
                                if (err)
                                    res.json({message: 'could not check guest in!'});
                            });
                            res.json({message: 'room assigned to guest'});
                        }
                        //res.json({message: 'it got inside were in'});
                    });
                }
                if (check === 0)
                    res.json({message: 'room could not be found'});
            });
        }
    });
}
    router.CheckoutRoom = (req, res) => {
        // Return a JSON representation of our list
        //res.setHeader('Content-Type', 'application/json');

        let guestname;
        let type;
        let check = 0;
        let roomno;

        Guests.findById({"_id": req.params.id}, function (err, guest) {
            if (err)
                res.send(err);
            else {
                //res.json({message: 'found guest'});
                type = guest.roomtype;
                guestname = guest.name;
                roomno = guest.roomno;

                Rooms.find({"number": roomno}, function (err, rooms) {
                    if (err)
                        res.send(err);
                    else {
                        //res.json({message: 'found rooms'});
                        rooms.forEach(function (room) {
                            if (check === 0 && room.roomtype === type) {

                                room.state = "Cleaning";
                                room.guest = "empty";
                                check = 1;
                                room.save(function (err) {
                                    if (err)
                                        res.json({message: 'could not empty room'});
                                })
                                guest.roomno = roomno;
                                guest.check = "out";
                                guest.save(function (err) {
                                    if (err)
                                        res.json({message: 'could not check guest out!'});
                                });
                                res.json({message: 'Guest checked out'});
                            }
                            //res.json({message: 'it got inside were in'});
                        });
                    }
                    if (check === 0)
                        res.json({message: 'room could not be found'});
                });
            }
        });
}

module.exports = router;