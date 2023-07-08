import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { registerNewAccount, signInAccount, deleteAccount, signOutAccount, authAccountwithPassword } from "./account.js";
import { createNewSpot, patchSpot, deleteSpot, getSpot } from "./spot.js";
import { getUser, patchUser } from "./user.js"

const port = 3141
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());

const firebaseConfig = {
    apiKey: "AIzaSyApBdX_ouOp0E9Bez09PtHyMa4UL-qDYBo",
    authDomain: "room-e5563.firebaseapp.com",
    projectId: "room-e5563",
    storageBucket: "room-e5563.appspot.com",
    messagingSenderId: "665563320009",
    appId: "1:665563320009:web:2bff29562834fdf4bac718",
    measurementId: "G-1NXQ4FX22V",
    databaseURL: "https://room-e5563-default-rtdb.asia-southeast1.firebasedatabase.app"
};
const firebase = initializeApp(firebaseConfig);
const db = getDatabase(firebase);
const auth = getAuth(firebase);
  

app.get('/test', (req, res) => {
    console.log(req.body);
    console.log("responted to /test");
    return res.status(200).json({ id: 2 });
});

app.get('/testDB', async (req,res) => {
    console.log(req)
    const testDataRef = ref(db, '/testDatabaseCollection')
    const snapshot = await get(testDataRef);
    let respond;
    console.log(snapshot.val());
    if (snapshot.exists()){
        respond = snapshot.val()
    } else {
        respond = "Nothing in the database"
    }
    console.log("All information retrieved from Database")
    return res.status(200).json({respond});
});

app.post('/testDB/spots', async (req, res) => {

    const testDataRef = ref(db, '/testDatabaseCollection/Spots');

    const newSpot = push(testDataRef)
    const data = req.body;
    await set(newSpot, data);

    console.log("Data added to the database");
    res.status(200).json({status: 200,message: "Data added to the database"});

});

// Not sure if we need this, I just put here for better manipulation of firebase atm
app.post('/auth/logoff', async (req,res) => {
    try {
        await signOutAccount();
        return res.status(200).json({status: 200,message: "Sign off successfully"});
    } catch (error) {
        return res.status(500).json({status: 500,error: error});
    }
});


// Account Registeration
app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    const respond = await registerNewAccount(email, password);
    
    if (respond.status === 201) {
        return res.status(201).json(respond);
    } else if (respond.status === 400) {
        res.status(400).json(respond)
    } else if (respond.status === 500) {
        res.status(500).json(respond)
    } else {
        return res.status(400).json({ message: 'Unknown Error' })
    }
});

// Login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const respond = await signInAccount(email, password);
    
    if (respond.status === 200) {
        return res.status(200).json(respond);
    } else if (respond.status === 500) {
        return res.status(500).json(respond);
    } else {
        return res.status(400).json({ message: 'Unknown Error' })
    }
});

//authentication usieng passowrd

app.post('/auth/:userID', async (req, res) => {
    const uid = req.params.userID;
    const { email, password } = req.body;
    const respond = await authAccountwithPassword(email, password);
    
    if (respond.status === 200) {
        return res.status(200).json(respond);
    } else if (respond.status === 400) {
        return res.status(400).json(respond);
    } else {
        return res.status(400).json({ message: 'Unknown Error' })
    }
});

// Account Deletion
app.delete('/user/:userId/delete', async (req, res) => {
    const uid = req.params.userId;
    const respond = await deleteAccount(uid);
    
    if (respond.status === 200) {
        return res.status(200).json(respond);
    } else if (respond.status === 500) {
        return res.status(500).json(respond);
    } else if (respond.status === 401) {
        return res.status(401).json(respond);
    } else {
        return res.status(400).json({ message: 'Unknown Error' })
    }
});

//Create new spot 
app.post('/spot/new', async (req, res) => {
    const data = req.body;
    const response = await createNewSpot(data);
    
    if (response.status === 201) {
        return res.status(201).json(response);
    } else if (response.status === 500) {
        return res.status(500).json(response);
    } else {
        return res.status(400).json({ message: 'Unknown Error' })
    }
});

//Update spot
app.patch('/spot/:spotId/update', async (req, res) => {
    const data = req.body;
    const sid = req.params.spotId

    const response = await patchSpot(sid, data);

    if (response.status === 200) {
        return res.status(200).json(response);
    } else if (response.status === 404) {
        return res.status(404).json(response);
    } else if (response.status === 500) {
        return res.status(500).json(response);
    } else {
        return res.status(400).json({ message: 'Unknown Error' })
    }
});

//Delete spot
app.delete('/spot/:spotId/delete', async (req, res) => {
    const sid = req.params.spotId

    const response = await deleteSpot(sid);

    if (response.status === 200) {
        return res.status(200).json(response);
    } else if (response.status === 404) {
        return res.status(404).json(response);
    } else if (response.status === 500) {
        return res.status(500).json(response);
    } else {
        return res.status(400).json({ message: 'Unknown Error' })
    }
});

//Get spot
app.get('/spot/:spotId', async (req, res) => {
    const sid = req.params.spotId
    const response = await getSpot(sid);

    if (response.status === 200) {
        return res.status(200).json(response);
    } else if (response.status === 404) {
        return res.status(404).json(response);
    } else if (response.status === 500) {
        return res.status(500).json(response);
    } else {
        return res.status(400).json({ message: 'Unknown Error' })
    }
});

// Get user profile
app.get('/user/:userID', async (req, res) => {
    const sid = req.params.userID
    const response = await getUser(sid);

    if (response.status === 200) {
        return res.status(200).json(response);
    } else if (response.status === 404) {
        return res.status(404).json(response);
    } else if (response.status === 500) {
        return res.status(500).json(response);
    } else {
        return res.status(400).json({ message: 'Unknown Error' })
    }
});


//Update User profile
app.patch('/user/:userID/update', async (req, res) => {
    const data = req.body;
    const uid = req.params.userID
    console.log('Patching user with following information');
    console.log(data);

    const response = await patchUser(uid, data);

    if (response.status === 200) {
        return res.status(200).json(response);
    } else if (response.status === 404) {
        return res.status(404).json(response);
    } else if (response.status === 500) {
        return res.status(500).json(response);
    } else {
        return res.status(400).json({ message: 'Unknown Error' })
    }
});

// 
app.post('/recommend/:userID', async (req, res) => { // TODO
    
    const num = req.body.num;
    const alreadyReceived = req.body.alreadyReceived;
    // Return num IDs of recommended spots for this user, that aren't 
    // included in alreadyReceived

    const arr = [];
    for (let i = 0; i < num; i++) {
        arr.push(`dummySpot${i + 1}`);
    };
    const response = {
        ids: arr,
    };
    return res.status(200).json(response);
});

app.post('/search', async (req, res) => { // TODO
    const requestBodyLooksLikeThis = {
        search: 'Sydney', // Just generic text, could be address or username
        minPrice: undefined, // int
        maxPrice: undefined, // int
        minDistance: undefined, // int
        maxDistance: undefined, // int
        minRating: undefined, // int
        vehicleType: undefined, // string, we need to figure out what the options are
        minClearance: undefined, // int
        evCharging: undefined, // bool
        disabledAccess: undefined, // book
        num: 20, // number of IDs to return
        alreadyReceived: [], // list of IDs already received, so don't return these, look for others
    }
    // Most for filters, if a filter isn't set then there won't be a 
    // field. So a request could JUST have a 'search' field

    const arr = [];
    for (let i = 0; i < req.body.num; i++) {
        arr.push(`dummySpot${i + 1}`);
    };
    const response = {
        ids: arr,
    };
    return res.status(200).json(response);
})

app.post('/book/:spotID/price', async (req, res) => { // TODO
    const requestBodyLooksLikeThis = {
        spotID: 30,
        startTime: 1688794787, // unix timestamp
        endTime: 1688795245, // unix timestamp
    }
    // We'll make sure that the timestamps passed from the frontend will
    // be on the hour

    const response = {
        price: 35.5 // float/double/whatever
    }
    if (true) { // If spot is available for this whole time
        return res.status(200).json(response);
    } else {
        return res.status(500).json({ error: 'spot not available' }); // don't change this error code without telling us
    }
})

app.post('/book/:spotID/confirm', async (req, res) => { // TODO
    const requestBodyLooksLikeThis = {
        spotID: req.params.spotID,
        startTime: 1688794787, // unix timestamp
        endTime: 1688795245, // unix timestamp
        cardNumber: '9234567898765432', // needs to be string to avoid integer overflow
        cardName: 'Joe Biden',
        cardCvv: 420,
    }

    if (true) { // If spot is available for this whole time
        return res.status(200).json({ status: 'OK' }); // Don't care what this says
    } else if (true) { // Spot became not available
        return res.status(500).json({ error: 'spot not available' }); // don't change this error code without telling us
    } else {
        return res.status(500).json({ error: 'other error' });
    }
})

app.get('/booking/:bookingID', async (req, res) => { // TODO
    const bookingID = req.params.bookingID;
    const requestBodyLooksLikeThis = {
        spotID: req.params.spotID,
        startTime: 1688794787, // unix timestamp
        endTime: 1688795245, // unix timestamp
        cardNumber: '9234567898765432', // needs to be string to avoid integer overflow
        cardName: 'Joe Biden',
        cardCvv: 420,
    }

    const response = {
        spotID: 28374592, // whatever ID format you usually use
        startTime: 1688794787, // unix timestamp
        endTime: 1688795245, // unix timestamp
        price: 34.8,
        refundAvailable: 0.5, // 0 for not available, 1 for 100%, 0.5 for 50%
        // include rating: and review: if those are available too
    }

    if (true) { // valid request
        return res.status(200).json(response);
    } else {
        return res.status(500).json({ error: 'invalid booking ID' }); // or other error, let us know
    }
})

app.post('/booking/:bookingID/review', async (req, res) => { // TODO
    const bookingID = req.params.bookingID;

    const requestBodyLooksLikeThis = {
        rating: 4, // star rating 1, 2, 3, 4, or 5
        review: 'great' // text review
    }

    if (true) { // valid request
        return res.status(200).json({ status: 'OK '}); // don't care what this says
    } else {
        return res.status(500).json({ error: 'invalid spot ID' });
    }
})

app.delete('/booking/:bookingID/cancel', async (req, res) => { // TODO
    const bookingID = req.params.bookingID;

    if (true) { // valid request
        return res.status(200).json({ status: 'OK '}); // don't care what this says
    } else {
        return res.status(500).json({ error: 'invalid spot ID' });
    }
})

app.get('/upcoming/:userID', (req, res) => { // TODO
    const userID = req.params.userID;

    const response = {
        asOwner: [3245, 45674], // list of IDs for bookings where this person is the owner, earliest to latest (can be empty)
        asRenter: [96, 12753475983], // list of IDs for bookings where this person is the renter, earliest to latest (can be empty)
    }

    if (true) { // valid request
        return res.status(200).json(response); // don't care what this says
    } else {
        return res.status(500).json({ error: 'invalid user ID' });
    }
})

app.get('/booking/:userID', (req, res) => { // TODO
    const userID = req.params.userID;

    const response = {
        asOwner: [3245, 45674], // list of IDs for bookings where this person is the owner, earliest to latest (can be empty)
        asRenter: [96, 12753475983], // list of IDs for bookings where this person is the renter, earliest to latest (can be empty)
    }

    if (true) { // valid request
        return res.status(200).json(response); // don't care what this says
    } else {
        return res.status(500).json({ error: 'invalid user ID' });
    }
})

const server = app.listen(port, () => {
    console.log(`Backend is now listening on port ${port}!`);
});

export default server