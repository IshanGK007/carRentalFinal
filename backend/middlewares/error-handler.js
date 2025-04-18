//this will be the last middleware which will help us centralize unexpected errors
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
};

module.exports = errorHandler;
