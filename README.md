# Assignment 1 - Agile Software Practice.

Name: Conor Rea / 20076065

## Overview.
This web app is designed to be used by staff in a hotel environment. It allows the staff to manage the rooms and guests while also keeping track of the status of each room. when someone approaches the staff they can add them to the system and they can be assigned a room which the system will find based on the amount of people and what kind of room they want. Once the system finds them a room that room is no longer available and they are considered checked in. When they have finished their stay the system will check them out and assign the room for cleaning. Once the room is clean the staff can make the room available again through the system so it can be assigned to a new guest. the room can also be sent for maintenence if there is a problem which will make that room univailable. once a few guests have been checked out the can all be delted from the system in one go instead of having to delete each person who has checked out.

#### GitHub link : https://github.com/CRea7/AgileTest
## API endpoints.

 + GET /guests              -Get all guests.
 + GET /guests/:id          -Get one guest by ID.
 + POST /guests             -Adds a guest.
 + DELETE /guests/remove    -Deletes all guests who are checked out.
 + DELETE /guests/:id       -Deletes guest by ID.
 
 + GET /rooms               -Get all rooms.
 + GET /rooms/empty         -Get all empty rooms.
 + GET /rooms/:id           -Get one room by ID.
 + PUT /rooms/ready/:id     -Sets room state to ready.
 + PUT /rooms/maintain/:id  -Sets room state to maintenance
 + DELETE /rooms/:id        -Deletes room by ID.
 
 + PUT /rooms/assign/:id    -Assigns room to guest. sets guests check to in and assigns room number. Sets room to occupied.
 + PUT /rooms/checkout/:id  -Checks guest out of room and sets status of room to cleaning and room guest to empty.

## Data model.

The database in its current state is very simple only making use of 2 models. A guest can stay in many rooms but only 1 room can house 1 guest so when a guest is checked in they're assigned to that room and no other.

Each guest has a check option which can have 3 different states which are in, out and waiting. if a guest is waiting they have not been assigned a room. If a guest is checked in they have been assigned a room. If the check is out the user has been checked out of the room and the room state is set to cleaning and guest empty.
Each guest also specify a room type and will only be checked into a room of that type.

When a guest is checked into a room the guests name is assigned to the room so the staff know who is in what room. the room also has a room type and capacity so the system can see if the room is eligible for the guest that is trying to be checked in.
#### Guests
~~~
[
     {
          "check": "in",
          "_id": "5da719c8478a5a1b1d53be60",
          "name": "Tom Green",
          "people": 3,
          "roomno": 165,
          "breakfast": "yes",
          "roomtype": "family"
     }
]
~~~
#### Rooms
~~~
[
     {
          "_id": "5da71af3478a5a1b1d53be64",
          "number": 165,
          "roomtype": "family",
          "capacity": "5",
          "state": "Occupied",
          "guest": "Tom Green"
     }
]
~~~
#### Relationship
![][datamodel]

## Sample Test execution.
~~~
Guestss
mongodb://localhost:27017/hoteldb
    GET /guests/:id
(node:3930) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
(node:3930) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
      when the id is valid
Successfully Connected to [ hoteldb ]
Successfully Connected to [ hoteldb ]
Successfully Connected to [ hoteldb ]
GET /guests/5dbff48f2afc3e0f5a261a3f 200 24.850 ms - 250
        ✓ should return the matching guest (80ms)
      when the id is invalid
GET /guests/9999 200 6.152 ms - 29
        ✓ should return the NOT found message
    GET /guests
GET /guests 200 7.214 ms - 500
      ✓ should GET all the guests
    DELETE /guests/:id
      when the id is valid
(node:3930) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
DELETE /guests/5dbff48f2afc3e0f5a261a45 200 13.023 ms - 28
        ✓ should DELETE the selected guest
      when the id is invalid
DELETE /guests/9999 200 3.020 ms - 32
        ✓ should return the NOT found message
    DELETE /guests/remove
      when the guest deletes successfully
(node:3930) DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
DELETE /guests/remove 200 6.294 ms - 29
        ✓ should DELETE guests who are checked out
GET /guests 200 4.805 ms - 252
    POST /guests
POST /guests 200 138.373 ms - 26
      ✓ should return confirmation message and update datastore (145ms)
GET /guests 200 5.756 ms - 750

  Roomss
    GET /rooms
GET /rooms 200 8.049 ms - 661
      ✓ should GET all the rooms
    GET /rooms/empty
GET /rooms/empty 200 6.984 ms - 436
      ✓ should GET all the empty rooms
    PUT /rooms/ready/:id
      When the id is valid
PUT /rooms/ready/5dbff4902afc3e0f5a261a53 200 7.021 ms - 25
        ✓ should change state of room to empty
      When the id is not valid
PUT /rooms/ready/9999 200 1.901 ms - 34
        ✓ should change state of room to empty
    PUT /rooms/maintain/:id
      When the id is valid
PUT /rooms/maintain/5dbff4902afc3e0f5a261a59 200 7.099 ms - 45
        ✓ should change state of room to empty
      When the id is not valid
PUT /rooms/maintain/9999 200 1.815 ms - 28
        ✓ should change state of room to empty
    GET /rooms/:id
      when the id is valid
GET /rooms/5dbff4902afc3e0f5a261a5f 200 8.227 ms - 227
        ✓ should return the matching room
      when the id is invalid
GET /rooms/9999 200 1.603 ms - 38
        ✓ should return the NOT found message
    DELETE /rooms/:id
      when the id is valid
DELETE /rooms/5dbff4902afc3e0f5a261a65 200 68.256 ms - 27
        ✓ should DELETE the matching room (75ms)
      when the id is invalid
DELETE /rooms/9999 200 1.359 ms - 31
        ✓ should return the NOT found message

  base
    PUT /rooms/assign/:id
      When the id is valid and room is available
PUT /rooms/assign/5dbff4902afc3e0f5a261a6f 200 11.624 ms - 36
        ✓ should assign guest to room
      When the id is not valid
PUT /rooms/maintain/5dbff4912afc3e0f5a261a72 200 6.660 ms - 45
PUT /rooms/assign/5dbff4912afc3e0f5a261a75 200 12.341 ms - 37
        ✓ should find guest and assign no room
      When the id is not valid
PUT /rooms/assign/9999 200 1.182 ms - 39
        ✓ should not find guest and assign no room
    PUT /rooms/checkout/:id
      When the id is valid and guest is in room
PUT /rooms/checkout/5dbff4912afc3e0f5a261a82 200 11.447 ms - 31
        ✓ should check guest out of room
      When the id is not valid
PUT /rooms/checkout/9999 200 1.173 ms - 38
        ✓ should not find guest and assign no room


  22 passing (3s)

~~~

## Api links

staging link:  https://hotel-api-staging.herokuapp.com/  
Production link: https://hotel-api-prod.herokuapp.com/
## Extra features.

while using the basic eslint configuration i was running into some problems I didnt like so I looked into the settings and changed them based on my preferences.
I also customised the eslint configuration to ignore some of the test blocks as it was falsely flagging them.


[datamodel]: ./img/datamodel.png
