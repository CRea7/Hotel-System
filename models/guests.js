let mongoose = require('mongoose');

let GuestSchema = new mongoose.Schema({
        name: String,
        people: Number,
        roomno: Number,
        breakfast: String,
        roomtype: String,
        check: {type: String, default: "waiting"}
        //upvotes: {type: Number, default: 0}
    },
    { collection: 'guests' });

module.exports = mongoose.model('Guest', GuestSchema);







// const guests = [
//     {id: 1000000, name: 'Tom Green', people: 3, roomno: 165, breakfast: true, roomtype: 'family', check: 'in'},
//     {id: 1000001, name: 'Sasha Rand', people: 5, roomno: 20, breakfast: false, roomtype: 'family', check: 'out'},
//     {id: 1000002, name: 'Conor Rea', people: 2, roomno: 67, breakfast: true, roomtype: 'double', check: 'waiting'},
//     {id: 1000003, name: 'jason bourne', people: 2, roomno: 54, breakfast: false, roomtype: 'single', check: 'in'}
// ];

//module.exports = guests;

    //{id: 0, name: "aaron clarke", people: 4, roomno: 78, breakfast: false, roomtype: "family", check: "waiting"}