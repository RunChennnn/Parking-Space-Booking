import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { registerNewAccount, signInAccount, deleteAccount, signOutAccount } from "./account.js";
import { createNewSpot, patchSpot, deleteSpot } from "./spot.js";

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
    
    if (respond.status === 200) {
        return res.status(200).json(respond);
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
    
    if (response.status === 200) {
        return res.status(200).json(response);
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

const server = app.listen(port, () => {
    console.log(`Backend is now listening on port ${port}!`);
});

export default server