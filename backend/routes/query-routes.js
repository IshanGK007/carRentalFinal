const express = require('express');
const queryRouter = express.Router();
const { postQuery, getQueries, updateQueryStatus } = require('../controllers/query/query-controller');

// POST route for submitting a query
queryRouter.post('/post-query', postQuery);

// GET route to fetch all queries
queryRouter.get('/fetch-query', getQueries);

// PUT route to update the query status
queryRouter.put('/update-query-status-by-id/:id', updateQueryStatus); // Make sure to use ':id' for the query ID parameter

module.exports = queryRouter;
