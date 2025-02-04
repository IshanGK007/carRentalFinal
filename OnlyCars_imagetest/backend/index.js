const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const { initGridFS } = require('./utils/gridfs'); // Import GridFS utility

// Internal dependencies
const errorHandler = require('./middlewares/error-handler');
const connectDatabase = require('./config/database');

// Route dependencies
const authRouter = require('./routes/auth-routes');
const carRouter = require('./routes/car-routes');
const paymentRouter = require('./routes/payment-routes');
const queryRouter = require('./routes/query-routes');
const imageRouter = require('./routes/image-routes');

// Jobs dependencies
const updateCarStatus = require('./jobs/update-car-status');

// Configure .env file
dotenv.config();

// Create server
const app = express();

// Use middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

// Final error handler
app.use(errorHandler);

// Connect to the database and initialize GridFS
connectDatabase()
    .then(() => {
        console.log('Connected to MongoDB database successfully!');
        initGridFS(); // Initialize GridFS after DB connection
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
        process.exit(1);  // Exit if the DB connection fails
    });

// Routes
app.use('/api/auth', authRouter);
app.use('/api/car', carRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/query', queryRouter);
app.use('/api/image', imageRouter);

// Set port
app.set('port', process.env.PORT || 5000);

// Listen to port
app.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);
    updateCarStatus();
});
