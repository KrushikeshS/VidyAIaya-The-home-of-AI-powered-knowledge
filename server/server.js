const express = require("express");
const dotenv = require("dotenv");

// Load env vars (we will create this file next)
dotenv.config({path: "./config/config.env"});

const app = express();

// A simple test route to make sure it's working
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in development mode on port ${PORT}`)
);
