const dotenv = require("dotenv");
// Load env vars
dotenv.config({path: "./config/config.env"});

const express = require("express");
const cors = require("cors"); // <-- Import
const connectDB = require("./config/db");

// Import routes
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");

// Connect to Database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.json());

// A simple test route to make sure it's working
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount routers
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
