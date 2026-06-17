require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRoute = require('./src/Routes/userRoute');
const reelRoute = require('./src/Routes/reelRoute');
const profileRoute = require('./src/Routes/profileRoute');
const connectDB = require('./src/db');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow localhost for local testing and resolve dynamic ports
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }
        // In production, you can add your deployed URL or allow dynamically
        return callback(null, true);
    },
    credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//form data
app.use(cookieParser());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 1000;

// Connect to Database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('hello world');
});

app.use('/api', userRoute);
app.use('/api', reelRoute);
app.use('/api', profileRoute);

app.listen(port, () => {
    console.log(`✓ Server started on port ${port}`);
});
