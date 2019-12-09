const expect = require("chai").expect;
const request = require("supertest");
const {MongoMemoryServer} = require("mongodb-memory-server");
const Guest = require("../../../models/guests");
const mongoose = require("mongoose");

let server;
let mongod;
let db, validID;

// let guest = new Guest();
// guest.name = "Tommy blue";
// guest.people = 5;
// guest.roomno = 0;
// guest.breakfast = true;
// guest.roomtype = "family";
// guest.check = "waiting";
//
// let guest2 = new Guest();
// guest2.name = "Chad Warren";
// guest2.people = 2;
// guest2.roomno = 45;
// guest2.breakfast = true;
// guest2.roomtype = "double";
// guest2.check = "in";

describe("Guestss", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    dbName: "donationsdb" // by default generate random dbName
                }
            });
            // Async Trick - this ensures the database is created before
            // we try to connect to it or start the server
            const connString = await mongod.getConnectionString();

            await mongoose.connect(connString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            server = require("../../../bin/www");
            db = mongoose.connection;
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
            await db.dropDatabase();
            await mongod.stop();
            await server.close();
        } catch (error) {
            console.log(error);
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
            let guest2 = new Guest();
            guest2.name = "Chad Warren";
            guest2.people = 2;
            guest2.roomno = 45;
            guest2.breakfast = true;
            guest2.roomtype = "double";
            guest2.check = "out";
            await guest2.save();
            guest = await Guest.findOne({people: 2});
            validID = guest._id;
        } catch (error) {
            console.log(error);
        }
    });

    describe("GET /guests/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching guest", done => {
                request(server)
                    .get(`/guests/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("people", 2);
                        expect(res.body[0]).to.have.property("name", "Chad Warren");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/guests/9999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Guest not found");
                        done(err);
                    });
            });
        });
    });
    describe("GET /guests", () => {
        it("should GET all the guests", done => {
            request(server)
                .get("/guests")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);
                        expect(res.body[0]).to.have.property("name", "Tommy blue");
                        expect(res.body[0]).to.have.property("people", 5);
                        expect(res.body[0]).to.have.property("roomno", 0);
                        expect(res.body[0]).to.have.property("breakfast", "true");
                        expect(res.body[0]).to.have.property("roomtype", "family");
                        expect(res.body[0]).to.have.property("check", "waiting");

                        expect(res.body[1]).to.have.property("name", "Chad Warren");
                        expect(res.body[1]).to.have.property("people", 2);
                        expect(res.body[1]).to.have.property("roomno", 45);
                        expect(res.body[1]).to.have.property("breakfast", "true");
                        expect(res.body[1]).to.have.property("roomtype", "double");
                        expect(res.body[1]).to.have.property("check", "out");
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

    describe("DELETE /guests/:id", () => {
        describe("when the id is valid", () => {
            it("should DELETE the selected guest", done => {
                request(server)
                    .delete(`/guests/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        //expect(Guest).to.have.length(1);
                        expect(res.body.message).equals("Guest deleted!");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .delete("/guests/9999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Guest not deleted!");
                        done(err);
                    });
            });
        });
    });

    describe("DELETE /guests/remove", () => {
        describe("when the guest deletes successfully", () => {
            it("should DELETE guests who are checked out", done => {
                request(server)
                    .delete("/guests/remove")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Guests deleted!");
                        done(err);
                    });
            });
        });
        after(() => {
            return request(server)
                .get("/guests")
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.length(1);
                });
        });
    });

    describe("POST /guests", () => {
        it("should return confirmation message and update datastore", () => {
            const guest = {
                name: "Tommy rad",
                people: 4,
                roomno: 50,
                breakfast: true,
                roomtype: "family",
            };
            return request(server)
                .post("/guests")
                .send(guest)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("Guest added!");
                    //validID2 = res.body.data._id;
                });
        });
        after(() => {
            return request(server)
                .get("/guests")
                .expect(200)
                .then(res => {
                    expect(res.body[2]).to.have.property("name", "Tommy rad");
                    expect(res.body[2]).to.have.property("people", 4);
                    expect(res.body[2]).to.have.property("roomno", 50);
                    expect(res.body[2]).to.have.property("breakfast", "true");
                    expect(res.body[2]).to.have.property("roomtype", "family");
                    expect(res.body[2]).to.have.property("check", "waiting");
                });
        });
    });

});