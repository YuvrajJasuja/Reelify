const express = require('express');
const cookieParser = require('cookie-parser');
const userRoute = require('./src/Routes/userRoute');
const connectDB = require('./src/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//form data
app.use(cookieParser());

const port = 1000;

// Connect to Database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('hello world');
});

app.use('/api', userRoute);

app.listen(port, () => {
    console.log(`✓ Server started at http://localhost:${port}`);
});
