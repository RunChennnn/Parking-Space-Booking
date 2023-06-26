import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const port = 3141
const auth = firebase.auth();
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


/*
 * Login request: if valid credentials, returns 200 OK as well as 
 * authentication token and user ID. If invalid, returns 401.
 */
app.post('/auth/login', (req, res) => {
    const body = req.body;
    if (body.email === 'example@email.com' && body.password === 'password') { // email and password are correct
        return res.status(200).json({ token: 'dummy', userID: 696969 }); // Return 200 OK, along with an authentication token (str) and user id (int)
    } else {
        return res.status(401).json({ error: 'invalid username or password' }) // Forbidden if incorrect credentials (don't change the error text pls)
    }
})

/*
 * Register request: if email doesn't already exist in database, add it 
 * (and the password) and return 200 OK as well as authentication token 
 * and user ID. If invalid, returns 400.
 */
app.post('/auth/register', (req, res) => {
    const body = req.body;
    if (body.email === 'example@email.com') { // email is already in the system
        return res.status(400).json({ error: 'email already used' }) // Forbidden if incorrect credentials (don't change the error text pls)
    } else {
        return res.status(200).json({ token: 'dummy2', userID: 420420 }); // Return 200 OK, along with an authentication token (str) and user id (int)
    }
})

app.get('/user/:userID', (req, res) => {
    const userID = parseInt(req.params.userID); // TODO error checking the parseInt, have fun backend guys
    console.log(`responding to user/${userID}`);
    if (userID === 696969) { // If this is a valid userID
        return res.status(200).json({
            email: 'example@email.com', // email attached to account
            upcoming: [872365, 1234907], // IDs of any upcoming bookings
            history: [540764,], // IDs of any historical bookings
            spots: [3294659, 4894, 1234567890], // IDs of any spots owned by this user
        })
    } else {
        return res.status(400).json({ error: 'invalid user ID' })
    }
})

app.delete('/user/:userID/delete', (req, res) => {
    const userID = parseInt(req.params.userID);
    if (userID === 696969) { // If this is a valid user ID
        // TODO remove this user from the database
        return res.status(200);
    } else {
        return res.status(400).json({ error: 'invalid user ID' });
    }
})

app.get('/spot/:spotID', (req, res) => {
    const userID = parseInt(req.params.spotID);
    if (true) { // If valid spot ID (for backend guys to implement)
        response = {
            description: 'a spot',
            streetNumber: 42,
            streetName: 'Wallaby Way',
            suburb: 'Sydney',
            postcode: 2000,
            basePrice: 16.5,
            largestVehicle: '4WD',
            clearance: 2.3,
            evCharging: true,
            disabledAccess: false,
            demandPricing: true,
            cardNumber: 1234567898765432,
            cardName: 'Donald Trump',
            cardCVV: 972,

        }
        return res.status(200).json(response);
    } else {
        return res.status(400).json({ error: 'invalid user ID' });
    }
})

const server = app.listen(port, () => {
    console.log(`Backend is now listening on port ${port}!`);
});

export default server