const express = require("express");
const cors = require("cors");
const app = express(); // Create instance of express
const PORT = 6000;

app.use(cors());
app.use(express.json());

let posts = [];

// Test
app.get("/", (req, res) => {
    res.send("Correct server.js is running");
});

app.listen(PORT, () => {
    console.log(`Sever is running on http://localhost:${PORT}`);
});