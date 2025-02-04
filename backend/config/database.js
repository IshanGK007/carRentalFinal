// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// const connectDatabase = async () => {
//     await mongoose.connect(process.env.MONGODB_URI);
// }

// module.exports = connectDatabase;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDatabase = async () => {
    try {
        // Establish MongoDB connection using the connection URI from environment variables
        await mongoose.connect(process.env.MONGODB_URI,);

        console.log('Connected to MongoDB database successfully!');

        // Listen for connection events
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            console.error(`Mongoose connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose connection disconnected');
        });

    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit process with failure code if DB connection fails
    }
};

// Gracefully handle server shutdown
process.on('SIGINT', async () => {
    console.log('SIGINT received, closing MongoDB connection...');
    await mongoose.disconnect();
    console.log('MongoDB disconnected gracefully');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing MongoDB connection...');
    await mongoose.disconnect();
    console.log('MongoDB disconnected gracefully');
    process.exit(0);
});

module.exports = connectDatabase;
