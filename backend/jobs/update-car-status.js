const cron = require('node-cron');
const Car = require('../models/car');

// Cron job to update car status after rental period ends
const updateCarStatus = () => {
    cron.schedule('0 * * * *', async () => { // Runs every hour
        console.log('Running cron job to update car status...');
        const now = new Date();

        try {
            const cars = await Car.find({ rentedTo: { $lte: now }, status: 'Not-Available' });

            for (const car of cars) {
                car.status = 'Available';
                car.rentedFrom = null;
                car.rentedTo = null;
                await car.save();
            }

            console.log(`Updated ${cars.length} cars to available status`);
        } catch (error) {
            console.error('Error updating car status:', error);
        }
    });
};

module.exports = updateCarStatus;
