const expect = require('chai').expect;
const express = require('express');
const request = require("supertest");
const {MongoMemoryServer} = require("mongodb-memory-server");
const Guest = require("../../../models/guests");
const mongoose = require("mongoose");
const _ = require("lodash");

let server;
let mongod;
let db, validID;

let guest = new Guest();
guest.name = "Tommy blue";
guest.people = 5;
guest.roomno = 0;
guest.breakfast = true;
guest.roomtype = "family";
guest.check = "waiting";

let guest2 = new Guest();
guest2.name = "Chad Warren";
guest2.people = 2;
guest2.roomno = 45;
guest2.breakfast = true;
guest2.roomtype = "double";
guest2.check = "in";

describe("Guestss", () => {
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
            await guest.save();
            await guest2.save();
            guest = await Guest.findOne({people: 2});
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
                .end((err, res) => {
                    console.log(res.body.check);
                    done()
                });
        });
    });
    describe("GET /guests/:id", () => {
        describe.only("when the id is valid", () => {
            it("should return the matching donation", done => {
                request(server)
                    .get(`/guests/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("people", 2)
                        expect(res.body[0]).to.have.property("name", "Chad Warren")
                        done(err)
                    })
            })
        })
    });
    describe("GET /guests", () => {
        it("should GET all the guests", done => {
            //console.log(server);
            console.log(validID);
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
                                check: guest.check,
                            }
                        });
                        console.log(result);
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