// const express = require('express');
// const uploadFile = require('../controllers/fileupload/uploadfile-controller');
// const fetchFile = require('../controllers/fetchfile/fetchfile-controller');
// const multer = require('../utils/multerFile'); // Your multer middleware
// const imageRouter = express.Router();

// // POST route for uploading an image
// imageRouter.post('/upload', multer, uploadFile);

// // GET route for fetching the image
// imageRouter.get('/file/:id', fetchFile);

// module.exports = imageRouter;

const express = require('express');
const uploadFile = require('../controllers/fileupload/uploadfile-controller');
const multerFile = require('../utils/multerFile'); // multer middleware for file upload
const imageRouter = express.Router();
const fetchFile = require('../controllers/fetchfile/fetchfile-controller');

// The route should be like this:
// imageRouter.post('/upload', multerFile, uploadFile);

imageRouter.post('/upload', (req, res, next) => {
    multerFile(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ success: false, message: 'File upload error' });
        }
        next();
    });
}, uploadFile);

imageRouter.get('/:id', fetchFile);


module.exports = imageRouter;
