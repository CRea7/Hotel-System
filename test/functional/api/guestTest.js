const expect = require('chai').expect;
const express = require('express');
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const Guest = require("../../../models/guests");
const mongoose = require("mongoose");
const _ = require("lodash");

let server;
let mongod;
let db, validID;

describe("Guestss", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "hoteldb" // by default generate random dbName
                }
            });
            // Async Trick - this ensures the database is created before
            // we try to connect to it or start the server
            await mongod.getConnectionString();

            mongoose.connect("mongodb://localhost:27017/hoteldb", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            server = require("../../../bin/www");
            console.log("hit");
            db = mongoose.connection
        } catch (error) {
            console.log(error)
        }
    });

    after(async () => {
        try {
            await db.dropDatabase();
            await mongod.stop();
            await server.close();
        } catch (error) {
            console.log(error)
        }
    });

    beforeEach(async () => {
        try {
            await Guest.deleteMany({});
            let guest = new Guest();
            guest.name = "Tommy blue";
            guest.people = 5;
            guest.roomno = 0;
            guest.breakfast = true;
            guest.roomtype = "family";
            guest.check = "waiting";
            await guest.save();
            guest = new Guest();
            guest.name = "Chad Warren";
            guest.people = 2;
            guest.roomno = 45;
            guest.breakfast = true;
            guest.roomtype = "double";
            guest.check = "in";
            await guest.save();
            guest = await Guest.findOne({people: 5});
            validID = guest._id;
        } catch (error) {
            console.log(error)
        }
    });

    describe("GET /guests", () => {
        it("should GET all the guests", done => {
            request(server)
                .get("/guests")
                .expect(200)
        });
    });
    describe("GET /guests", () => {
        it("should GET all the guests", done => {
            console.log(server);
            request(server)
                .get("/guests")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, guest => {
                            return {
                                name: guest.name,
                                people: guest.people,
                                roomno: guest.roomno,
                                breakfast: guest.breakfast,
                                roomtype: guest.roomtype,
                                check: guest.check
                            }
                        });
                        expect(result).to.deep.include({
                            name: "Tommy blue",
                            people: 5,
                            roomno: 0,
                            breakfast: true,
                            roomtype: "family",
                            check: "waiting"
                        });
                        expect(result).to.deep.include({
                            name: "Chad Warren",
                            people: 2,
                            roomno: 45,
                            breakfast: true,
                            roomtype: "double",
                            check: "in"
                        });
                        done()
                    } catch (e) {
                        done(e)
                    }
                });
        });
    });

});