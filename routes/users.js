let users = require("../models/users");
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectionString = "mongodb://localhost:27017/hoteldb";
mongoose.connect(connectionString);

let db = mongoose.connection;

db.on("error", function (err) {
    console.log("Unable to Connect to [ " + db.name + " ]", err);
});

db.once("open", function () {
    console.log("Successfully Connected to [ " + db.name + " ]");
});

router.createUser = async (req, res) => {

    res.setHeader("content-Type", "application/json");

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(req.body.password.toString(), salt)

    var user = new users();

    user.name = req.body.name;
    user.password = hashedpass;

    console.log(salt);
    console.log(hashedpass);

    user.save(function(err) {
        if (err)
            res.json({ message: "User not created!" });
        else
            res.json({ message: "User created!" });
    });

};

router.login = (req, res) => {

    res.setHeader("content-Type", "application/json");

    var user = new user;
    user.name = req.body.name;
    user.password = req.body.password;
    //this is alternative to easier code

    Rooms.find({"name": req.body.name}, function (err,User) {
        if (err)
            res.json({message: "could not ready room"});
        else {
            var value = User.password;

            var decipher = crypto.createDecipher(algorithm,password)
            var dec = decipher.update(value,'hex','utf8')
            dec += decipher.final('utf8');

            res.json({message: "room Ready!"});
        }

    });
};


module.exports = router;