const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

// API to serve JSON data
app.get("/api/research", (req, res) => {
    fs.readFile("data.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ message: "Error reading file", error: err });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
