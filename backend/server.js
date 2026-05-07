const express = require("express");
const cors = require("cors");
const app = express(); // Create instance of express
const PORT = 4000;

app.use(cors());
app.use(express.json());

let posts = [];

// Test
app.get("/", (req, res) => {
    res.send("Correct server.js is running");
});

// GET
app.get("/api/statuses", (req,res) => {
    res.json(statuses);
});

// POST
app.post("/api/statuses", (req, res) => {
    const{title, msg, severity} = req.body;
    if (!title || !msg ||!severity) {
        return res.status(400).json({error:"Please fill out all required fields"});
    }

    const newPost = {
        id: Date.now(),
        title,
        msg,
        severity,
        createdAt: new Date().toLocaleDateString()
    };
    statuses.unshift(newPost);
    res.status(201).json(newPost);
});



app.listen(PORT, () => {
    console.log(`Sever is running on http://localhost:${PORT}`);
});