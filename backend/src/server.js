import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

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


// Actual requests we need to listen for
app.post('/auth/login', (req, res) => {
    const body = req.body;
    if (body.email === 'example@email.com' && body.password === 'password') { // email and password are correct
        return res.status(200).json({ token: 'dummy', userID: 696969 }); // Return 200 OK, along with an authentication token (str) and user id (int)
    } else {
        return res.status(401).json({ error: 'invalid username or password' }) // Forbidden if incorrect credentials
    }
})


const server = app.listen(port, () => {
    console.log(`Backend is now listening on port ${port}!`);
});

export default server