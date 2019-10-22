let mongoose = require('mongoose');

let RoomSchema = new mongoose.Schema({
        number: Number,
        roomtype: String,
        capacity: String,
        guest: String,
        state: String
        //upvotes: {type: Number, default: 0}
    },
    { collection: 'rooms' });

module.exports = mongoose.model('Room', RoomSchema);



// const rooms = [
//     {number: 200, roomtype: 'double', capacity: 2, guest: null, state: 'Ready'},
//     {number: 165, roomtype: 'family', capacity: 4, guest: 'Tom Green', state: 'Occupied'},
//     {number: 49, roomtype: 'double', capacity: 2, guest: null, state: 'Maintenance'},
//     {number: 20, roomtype: 'family', capacity: 5, guest: null, state: 'Cleaning'},
//     {number: 67, roomtype: 'double', capacity: 2, guest: 'Conor Rea', state: 'Occupied'},
//     {number: 54, roomtype: 'single', capacity: 2, guest: 'jason bourne', state: 'Occupied'},
//     {number: 70, roomtype: 'family', capacity: 5, guest: null, state: 'Ready'}
// ];
//
// module.exports = guests;