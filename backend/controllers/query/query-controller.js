const Car = require('../../models/car');
const User = require('../../models/user'); // Ensure you have a User model if you're referencing users
const Query = require('../../models/query');

// POST endpoint to handle form submission and insert query
const postQuery = async (req, res) => {
  const { name, email, message, contactInfo, category, carId, userId } = req.body;

  // Validate form input
  if (!name || !email || !message || !carId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Step 1: Find the car owner by carId
    const car = await Car.findById(carId).select('soldBy');
    if (!car) {
      return res.status(404).json({ error: 'Car not found.' });
    }

    // Optionally, check if userId is valid if provided
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
    }

    // Step 2: Create a new query document
    const newQuery = new Query({
      carId,
      userId, // optional
      question: message,
      contactInfo, // optional
      category, // optional
      status: 'pending',
    });

    // Save the query to the database
    const savedQuery = await newQuery.save();

    // Optionally, send an email to the car owner (you can integrate an email service here)

    // Step 3: Respond with success
    res.status(201).json({
      message: 'Query submitted successfully',
      query: savedQuery,
    });

  } catch (error) {
    console.error('Error while posting query:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET all queries
const getQueries = async (req, res) => {
  try {
    console.log("Fetching queries...");
    
    const queries = await Query.find(); // Fetch all queries
    res.json(queries);
    // console.log("Queries fetched : " + queries);
    
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//get quries based on userid
const getQueriesById = async (req, res) => {
  try {
    console.log("Fetching queries for user...");

    // Ensure user is authenticated and get user ID from token (req.user is set by verifyToken middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id; // Extract userId from the request
    console.log("User ID:", userId);

    // Fetch queries where the user is the creator (adjust based on your schema)
    const queries = await Query.find({ userId }); 

    if (!queries.length) {
      return res.status(404).json({ message: "No queries found for this user" });
    }

    res.json(queries);
  } catch (err) {
    console.error("Error fetching queries:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// PUT - Update query status and response
const updateQueryStatus = async (req, res) => {
  const { id } = req.params; // Query ID from URL
  const { answered, answer, status } = req.body; // Ensure that the `answer` and `status` are being passed
  
  const answeredAt = answered ? new Date().toISOString() : null; // Set answeredAt to current time if answered

  try {
    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { answered, answeredAt, answer, status }, // Update the fields
      { new: true }
    );

    if (!updatedQuery) {
      return res.status(404).json({ message: 'Query not found' });
    }

    res.json(updatedQuery); // Respond with the updated query
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports = {
  postQuery,
  getQueries,
  updateQueryStatus
};
