const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Not-Available'],
        default: 'Available'
    },
    soldBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    rentedFrom: {
        type: Date,
        default: null,
    },
    rentedTo: {
        type: Date,
        default: null,
    },
    type: {
        type: String,
        enum: ['suv', 'sedan', 'hatchbacks', 'luxury'],
        default: 'sedan',
    },
    price: {
        type: Number,  // Price of the car
        required: true
    },
    rating: {
        type: Number,  // Rating of the car (out of 5 stars)
        min: 0,
        max: 5,
        default: 4.5
    },
    description: {
        type: String,  // Description of the car
        required: true
    },
    location: {
        type: String,  // Location where the car is available
        required: true
    },
    contact: {
        type: String,  // Contact number of the car owner
        required: true
    },
    features: {
        type: [String],  // Array of features of the car
        required: true
    },
    imageId: {
        type: String,  // ID of the image associated with the car
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const Car = mongoose.models.Car || mongoose.model('Car', carSchema);

module.exports = Car;