const expect = require("chai").expect;
const request = require("supertest");
const {MongoMemoryServer} = require("mongodb-memory-server");
const Room = require("../../../models/rooms");
const mongoose = require("mongoose");

let server;
let mongod;
let db, validID;

describe("Roomss", () => {
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
            await Room.deleteMany({});
            let room = new Room();
            room.number = 1;
            room.roomtype = "family";
            room.capacity = 5;
            room.guest = "Tommy blue";
            room.state = "occupied";
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
            room3.guest = "empty";
            room3.state = "Ready";
            await room3.save();
            room = await Room.findOne({guest: "Tommy blue"});
            validID = room._id;
        } catch (error) {
            console.log(error);
        }
    });

    describe("GET /rooms", () => {
        it("should GET all the rooms", done => {
            request(server)
                .get("/rooms")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(3);
                        expect(res.body[0]).to.have.property("number", 1);
                        expect(res.body[0]).to.have.property("roomtype", "family");
                        expect(res.body[0]).to.have.property("capacity", "5");
                        expect(res.body[0]).to.have.property("guest", "Tommy blue");
                        expect(res.body[0]).to.have.property("state", "occupied");

                        expect(res.body[1]).to.have.property("number", 2);
                        expect(res.body[1]).to.have.property("roomtype", "double");
                        expect(res.body[1]).to.have.property("capacity", "2");
                        expect(res.body[1]).to.have.property("guest", "empty");
                        expect(res.body[1]).to.have.property("state", "Ready");

                        expect(res.body[2]).to.have.property("number", 3);
                        expect(res.body[2]).to.have.property("roomtype", "single");
                        expect(res.body[2]).to.have.property("capacity", "2");
                        expect(res.body[2]).to.have.property("guest", "empty");
                        expect(res.body[2]).to.have.property("state", "Ready");

                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

    describe("GET /rooms/empty", () => {
        it("should GET all the empty rooms", done => {
            request(server)
                .get("/rooms/empty")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);

                        expect(res.body[0]).to.have.property("number", 2);
                        expect(res.body[0]).to.have.property("roomtype", "double");
                        expect(res.body[0]).to.have.property("capacity", "2");
                        expect(res.body[0]).to.have.property("guest", "empty");
                        expect(res.body[0]).to.have.property("state", "Ready");

                        expect(res.body[1]).to.have.property("number", 3);
                        expect(res.body[1]).to.have.property("roomtype", "single");
                        expect(res.body[1]).to.have.property("capacity", "2");
                        expect(res.body[1]).to.have.property("guest", "empty");
                        expect(res.body[1]).to.have.property("state", "Ready");

                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });
    describe("PUT /rooms/ready/:id", () => {
        describe("When the id is valid", () => {
            it("should change state of room to empty", done => {
                request(server)
                    .put(`/rooms/ready/${validID}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("room Ready!");
                        done(err);
                    });
            });
        });
        describe("When the id is not valid", () => {
            it("should change state of room to empty", done => {
                request(server)
                    .put("/rooms/ready/9999")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("could not ready room");
                        done(err);
                    });
            });
        });
    });

    describe("PUT /rooms/maintain/:id", () => {
        describe("When the id is valid", () => {
            it("should change state of room to empty", done => {
                request(server)
                    .put(`/rooms/maintain/${validID}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("room scheduled for maintenance!");
                        done(err);
                    });
            });
        });
        describe("When the id is not valid", () => {
            it("should change state of room to empty", done => {
                request(server)
                    .put("/rooms/maintain/9999")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("room not found");
                        done(err);
                    });
            });
        });
    });

    describe("GET /rooms/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching room", done => {
                request(server)
                    .get(`/rooms/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("number", 1);
                        expect(res.body[0]).to.have.property("guest", "Tommy blue");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/rooms/9999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("room could not be found!");
                        done(err);
                    });
            });
        });
    });

    describe("DELETE /rooms/:id", () => {
        describe("when the id is valid", () => {
            it("should DELETE the matching room", done => {
                request(server)
                    .delete(`/rooms/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).to.equal("Room deleted!");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .delete("/rooms/9999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Room not deleted!");
                        done(err);
                    });
            });
        });
    });
});