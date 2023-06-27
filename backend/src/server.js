import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { registerNewAccount, signInAccount, deleteAccount, signOutAccount } from "./account.js";
import { createNewSpot, patchSpot, deleteSpot, getSpot } from "./spot.js";

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

/*
 * Login request: if valid credentials, returns 200 OK as well as 
 * authentication token and user ID. If invalid, returns 401.
 */
// app.post('/auth/login', (req, res) => {
//     const body = req.body;
//     if (body.email === 'example@email.com' && body.password === 'password') { // email and password are correct
//         return res.status(200).json({ token: 'dummy', userID: 696969 }); // Return 200 OK, along with an authentication token (str) and user id (int)
//     } else {
//         return res.status(401).json({ error: 'invalid username or password' }) // Forbidden if incorrect credentials (don't change the error text pls)
//     }
// })

/*
 * Register request: if email doesn't already exist in database, add it 
 * (and the password) and return 200 OK as well as authentication token 
 * and user ID. If invalid, returns 400.
 */
// app.post('/auth/register', (req, res) => {
//     const body = req.body;
//     if (body.email === 'example@email.com') { // email is already in the system
//         return res.status(400).json({ error: 'email already used' }) // Forbidden if incorrect credentials (don't change the error text pls)
//     } else {
//         return res.status(200).json({ token: 'dummy2', userID: 420420 }); // Return 200 OK, along with an authentication token (str) and user id (int)
//     }
// })

app.post('/auth/:userID', (req, res) => {
    const body = req.body;
    const userID = parseInt(req.params.userID);
    console.log(body);
    console.log(userID);
    if (userID === 696969 && body.password === 'password') { // Correct password for user ID. TODO maybe add authentication with token here too
        return res.status(200).json({ userID: userID }) // Successful authentication
    } else if (true) { // User ID doesn't exist
        return res.status(400).json({ error: 'invalid user ID' });
    } else {
        return res.status(400).json({ error: 'incorrect password' });
    }
})

app.get('/user/:userID', (req, res) => {
    const userID = parseInt(req.params.userID);
    database.ref(`/users/${userID}`).once('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            const { email, upcoming, history, spots } = userData;

            return res.status(200).json({
                email: email || 'No email found',
                upcoming: upcoming || [],
                history: history || [],
                spots: spots || [],
            });
        } else {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
    });
});

app.patch('/user/:userID/update', (req, res) => {
    const userID = parseInt(req.params.userID);
    const body = req.body;
    
    if (userID === 696969) { // If valid user ID
        const parametersToUpdate = {};

        // looooooooooooooooooooop
        if (body.description) {
            parametersToUpdate.description = body.description;
        }
        if (body.streetNumber) {
            parametersToUpdate.streetNumber = body.streetNumber;
        }
        if (body.streetName) {
            parametersToUpdate.streetName = body.streetName;
        }
        if (body.suburb) {
            parametersToUpdate.suburb = body.suburb;
        }
        if (body.postcode) {
            parametersToUpdate.postcode = body.postcode;
        }
        if (body.basePrice) {
            parametersToUpdate.basePrice = body.basePrice;
        }
        if (body.largestVehicle) {
            parametersToUpdate.largestVehicle = body.largestVehicle;
        }
        if (body.clearance) {
            parametersToUpdate.clearance = body.clearance;
        }
        if (body.evcharging) {
            parametersToUpdate.evcharging = body.evcharging;
        }
        if (body.disabledaccess) {
            parametersToUpdate.disabledaccess = body.disabledaccess;
        }
        if (body.demandpricing) {
            parametersToUpdate.demandpricing = body.demandpricing;
        }
        if (body.cardnumber) {
            parametersToUpdate.cardnumber = body.cardnumber;
        }
        if (body.cardname) {
            parametersToUpdate.cardname = body.cardname;
        }
        if (body.cardcvv) {
            parametersToUpdate.cardcvv = body.cardcvv;
        }
        if (body.owner) {
            parametersToUpdate.owner = body.owner;
        }
        
        // we need to update the corresponding parameters in the database
        // return the updated parameters to the frontend
        return res.status(200).json(parametersToUpdate);
    } else {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
});

app.delete('/user/:userID/delete', (req, res) => {
    const userID = parseInt(req.params.userID);
    if (userID === 696969) { // If this is a valid user ID
        // TODO remove this user from the database
        return res.status(200).json({});
    } else {
        return res.status(400).json({ error: 'invalid user ID' });
    }
})

app.get('/spot/:spotID', (req, res) => {
    const spotID = parseInt(req.params.spotID);
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
            owner: 696969, // ID of owner
        }
        return res.status(200).json(response);
    } else {
        return res.status(400).json({ error: 'invalid user ID' });
    }
})

app.post('/spot/new', (req, res) => {
    const data = req.body; // expect this to have the same format as the return value to GET /spot/:spotID
    if (true) { // If valid request? Maybe do some checking before trying to add to database
        // Add to database
        return res.status(200);
    } else {
        return res.status(400).json({ error: 'invalid input' });
    }
})

app.post('/spot/:spotID/update', (req, res) => {
    const data = req.body; // expect this to have the same format as the return value to GET /spot/:spotID
    const spotID = parseInt(req.params.spotID);
    if (true) { // If valid request and ID is a currently existing spotID
        // Update in database
        return res.status(200);
    } else {
        if (true) { // If ID invalid
            return res.status(400).json({ error: 'invalid spot ID' });
        } else {
            return res.status(400).json({ error: 'invalid input' });
        }
    }
})

app.delete('/spot/:spotID/delete', (req, res) => {
    const spotID = parseInt(req.params.spotID);
    if (true) { // If valid spot ID
        // Remove from database
        return res.status(200);
    } else {
        return res.status(400).json({ error: 'invalid spot ID' });
    }
})

const server = app.listen(port, () => {
    console.log(`Backend is now listening on port ${port}!`);
});

export default server