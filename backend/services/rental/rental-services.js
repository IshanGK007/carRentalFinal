const Car = require('../../models/car');
const User = require('../../models/user');

// Rent Car
const rentCar = async ({ carId, userId, rentedFrom, rentedTo }) => {
    try {
        if (!carId || !userId) {
            return { success: false, message: 'All fields (carId, userId) are required.' };
        }

        const car = await Car.findById(carId);
        if (!car) {
            return { success: false, message: 'Car not found' };
        }

        if (car.status !== 'Available') {
            return { success: false, message: 'Car is not available' };
        }

        // Fetch user to ensure they exist
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (!rentedFrom || !rentedTo) {
            return { success: false, message: 'Rental dates are required' };
        }

        const from = new Date(rentedFrom);
        const to = new Date(rentedTo);

        if (from >= to) {
            return { success: false, message: 'Invalid rental period' };
        }

        car.rentedFrom = from;
        car.rentedTo = to;
        car.status = 'Not-Available';
        await car.save();

        return { success: true, message: 'Car rented successfully', car };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Server error', error };
    }
};


module.exports = {rentCar};