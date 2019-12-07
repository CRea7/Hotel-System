require('dotenv').config();
let users = require("../models/users");
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

let pubToken = null;

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

function PassCheck(storedPass, enteredPass){

    try {
        console.log(storedPass);
        console.log(enteredPass);
        bcrypt.compare(enteredPass,storedPass)
            .then(match => {
                if (!match) {
                    return(false);
                }else{
                    return(true);
                }
    });
    }catch(e){
        return (e);
    }
}
router.verifyToken = ((req, res, next) => {

    const token = pubToken;
    //const token = req.headers.authorization || req.headers['authenticate'];
    //const token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(req.headers);
    //const token = "eyJhbGciOiJIUzI1NiJ9.Q29ub3IgUmVh.dXGBA0iExY-w0WuBHTheDY6Ppkz_cmR33drP0CBx-J8"
    //console.log(process.env.ACCESS_TOKEN);
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
        if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        console.log("Token Okay");
        next();
    });
});

router.login = (req, res) => {

    res.setHeader("content-Type", "application/json");
    let usercheck = false;
    var fuser;

    users.find(function(err, users) {
        if (err)
            res.send(err);

        users.forEach(function (user) {
            if(user.name === req.body.name) {
                usercheck = true;
                fuser = user;
                //console.log(user.name);
            }
        });

        if(usercheck === false)
        {
            return res.status(400).send("Cannot find user");
        }else{

            try {
                bcrypt.compare(req.body.password,fuser.password)
                    .then(match => {
                        if (!match) {
                            res.send("shid")
                        }else{
                            //console.log(process.env.ACCESS_TOKEN);
                            const token = jwt.sign(fuser.name, process.env.ACCESS_TOKEN);

                            pubToken = token;
                            //req.headers.authorization = token;
                            //req.headers['authorization'] = token;
                            res.status(200).send({ message: 'Login Successful', token: token });
                        }
                    });
            }catch(e){
                return (e);
            }
        }
    });

    //console.log(usercheck);


    // var user = users();
    // user.name = req.body.name;
    //
    // const user1 = users.find(user => user.name = req.body.name);
    // if (user1 == null)
    // {
    //     return res.status(400).send("Cannot find user");
    // }
    // try {
    //     if(await bcrypt.compare(req.body.password,user.password))
    //     {
    //         res.send("LoggedIn");
    //     }else
    //     {
    //         res.send("LogInError");
    //     }
    // }catch(e){
    //     res.status(500).send();
    // }


};


module.exports = router;