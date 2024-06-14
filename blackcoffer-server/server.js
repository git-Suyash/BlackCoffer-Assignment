require("dotenv").config();
const mongoose = require ("mongoose");
// const fs = require ("fs");
const Data = require("./models/dataSchema");
const express = require("express");
const cors = require("cors");

const uri = process.env.MONGO_URI;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin : "http://localhost:5173",
    optionsSuccessStatus : 200
}))

mongoose.connect(uri).then(
    () => {
        console.log("db connected");
    }
)

// fs.readFile('jsondata.json', 'utf8', async (err, data) => {
//     if (err) throw err;
//     const jsonData = await JSON.parse(data);

//     if (Array.isArray(jsonData)) {
//         try{
//         await Data.create(jsonData);
//         } catch(err) {
//             console.log(err.message);
//         }
//     }
// });

app.get("/api/data", async (req, res) => {
    try {
        const data = await Data.find({});
        // console.log(data);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});