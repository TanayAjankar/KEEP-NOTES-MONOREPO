// Load environment variables from .env file
require("dotenv").config();

// Import required dependencies
const express = require("express");
const connectDB = require('./config/database');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { requireAuth } = require("./middleware/authMiddleware");

// Configure passport authentication strategies
require('./config/passport')(passport);

// Initialize Express application
const app = express();

// Middleware Configuration
// Enable CORS for cross-origin requests
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [process.env.CLIENT_URL, 'http://localhost:5173'];
    if (!origin) return callback(null, true); // allow server-to-server or same-origin
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies in requests
app.use(express.json());

// Configure session management
app.use(session({
  secret: process.env.SESSION_SECRET, // Secret key for session encryption
  resave: false,                     // Don't save session if unmodified
  saveUninitialized: false           // Don't create session until something stored
}));

// Initialize Passport Authentication
app.use(passport.initialize());       // Initialize Passport middleware
app.use(passport.session());         // Use persistent login sessions

// Add cookie parser middleware
app.use(cookieParser());

// API Routes
app.get('/test', (req, res) => {
  res.json({
    "success": true,
    "message": "API is working!"
  });
});

app.get('/test-protected', requireAuth, (req, res) => {
  res.json({
    "success": true,
    "message": "API is working!"
  })
});

app.use('/auth', require('./routes/auth.route'));    // Authentication routes

// app.use('/notes', require('./routes/notes'));  // Notes CRUD operations

// Server Configuration
const PORT = process.env.PORT;            // Use PORT from env or default to 5001
const HOST = process.env.HOST;     // Use HOST from env or default to localhost

// Start the server first before database connection

//HOST on specific IP address
// const server = app.listen(PORT, HOST, (e) => {
//   console.log(`Server running at http://${HOST}:${PORT}`);
  
//   // Connect to MongoDB after server is running
//   // This ensures the server can handle requests even if DB connection fails
//   connectDB();
// });

//HOST on localhost
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  // Connect to MongoDB after server is running
  // This ensures the server can handle requests even if DB connection fails
  connectDB();
});
