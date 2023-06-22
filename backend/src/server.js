import express from "express";
import cors from 'cors';

const port = 3141

const app = express();
app.use(cors());

app.get('/test', (req, res) => {
    console.log(req.body);
    console.log("responted to /test");
    return res.json({ id: 2 });
});

const server = app.listen(port, () => {
    console.log(`Backend is now listening on port ${port}!`);
    // console.log(`For API docs, navigate to http://localhost:${port}`);
});

export default server