const expect = require('chai').expect;
const express = require('express');
const request = require("supertest");
const {MongoMemoryServer} = require("mongodb-memory-server");
const Guest = require("../../../models/guests");
const Room = require("../../../models/rooms");
const mongoose = require("mongoose");
const _ = require("lodash");

let server;
let mongod;
let db, validID, validID2, validID3;

describe("base", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer();
            // Async Trick - this ensures the database is created before
            // we try to connect to it or start the server
            const connString = await mongod.getConnectionString();

            await mongoose.connect(connString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            server = require("../../../bin/www");
            db = mongoose.connection
        } catch (error) {
            console.log(error)
        }
    });

    // after(async () => {
    //     try {
    //         await db.dropDatabase();
    //         await mongod.stop();
    //         await server.close();
    //     } catch (error) {
    //         console.log(error)
    //     }
    // });

    beforeEach(async () => {
        try {
            await Room.deleteMany({});
            let room = new Room();
            room.number = 1;
            room.roomtype = "family";
            room.capacity = 5;
            room.guest = "Tommy blue";
            room.state = "Occupied";
            await room.save();
            let room2 = new Room();
            room2.number = 2;
            room2.roomtype = "double";
            room2.capacity = 2;
            room2.guest = "empty";
            room2.state = "Ready";
            await room2.save();
            let room3 = new Room();
            room3.number = 3;
            room3.roomtype = "single";
            room3.capacity = 2;
            room3.guest = "Bojack Horseman";
            room3.state = "Occupied";
            await room3.save();
            room = await Room.findOne({roomtype: "double"});
            validID = room._id;

            await Guest.deleteMany({});
            let guest = new Guest();
            guest.name = "Tommy blue";
            guest.people = 5;
            guest.roomno = 0;
            guest.breakfast = true;
            guest.roomtype = "family";
            guest.check = "waiting";
            await guest.save();
            let guest2 = new Guest();
            guest2.name = "Chad Warren";
            guest2.people = 2;
            guest2.roomno = 45;
            guest2.breakfast = true;
            guest2.roomtype = "double";
            guest2.check = "out";
            await guest2.save();
            let guest3 = new Guest();
            guest3.name = "Bojack Horseman";
            guest3.people = 1;
            guest3.roomno = 3;
            guest3.breakfast = false;
            guest3.roomtype = "single";
            guest3.check = "in";
            await guest3.save();

            guest = await Guest.findOne({people: 2});
            validID2 = guest._id;
            guest = await Guest.findOne({name: "Bojack Horseman"});
            validID3 = guest._id;
        } catch (error) {
            console.log(error)
        }
    });

    describe("PUT /rooms/assign/:id", () => {
        describe("When the id is valid and room is available", () => {
            it("should assign guest to room", done => {
                request(server)
                    .put(`/rooms/assign/${validID2}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("room assigned to guest");
                        done(err);
                    });
            });
        });
        describe("When the id is not valid", () => {
            it("should find guest and assign no room", done => {
                request(server)
                    .put(`/rooms/maintain/${validID}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("room scheduled for maintenance!");
                    });
                request(server)
                    .put(`/rooms/assign/${validID2}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("room could not be found");
                        done(err);
                    });
            });
        });
        describe("When the id is not valid", () => {
            it("should not find guest and assign no room", done => {
                request(server)
                    .put(`/rooms/assign/9999`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("guest could not be found!");
                        done(err);
                    });
            });
        });
    });


    describe("PUT /rooms/checkout/:id", () => {
        describe("When the id is valid and guest is in room", () => {
            it("should check guest out of room", done => {
                request(server)
                    .put(`/rooms/checkout/${validID3}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Guest checked out");
                        done(err);
                    });
            });
        });
        describe("When the id is not valid", () => {
            it("should not find guest and assign no room", done => {
                request(server)
                    .put(`/rooms/checkout/9999`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("guest could not be found");
                        done(err);
                    });
            });
        });
    });

});