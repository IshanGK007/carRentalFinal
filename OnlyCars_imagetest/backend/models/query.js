const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  // The car related to the query (linking to a car model)
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cars',  // Reference to the Car collection
    required: true
  },

  // The user who asked the question (optional if anonymous)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',  // Reference to the User collection (if you're tracking users)
    required: false
  },

  // The question the user asked
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500  // You can set a max length for the question if needed
  },

  // A flag to know if the query has been answered
  answered: {
    type: Boolean,
    default: false
  },

  // The answer to the question, if applicable
  answer: {
    type: String,
    trim: true,
    maxlength: 1000, // Max length for answer
    required: false
  },

  // Date when the question was asked
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Date when the answer was given (if answered)
  answeredAt: {
    type: Date,
    default: null
  },

  // Status to track if the question was resolved or pending
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending'
  },

  // If you want to allow users to leave their contact info for follow-up
  contactInfo: {
    type: String,
    required: false,
    trim: true
  },

  // Optional: Categorize the type of question (e.g., availability, price, condition)
  category: {
    type: String,
    enum: ['availability', 'price', 'condition', 'features', 'others'],
    required: false
  }
},{timestamps: true});

// Create a model from the schema
const Query = mongoose.model('Query', querySchema);

module.exports = Query;
