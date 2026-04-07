const express = require('express');
const cookieParser = require('cookie-parser');
const userRoute = require('./src/Routes/userRoute');
const connectDB = require('./src/db');
require('dotenv').config();

const app = express();

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
