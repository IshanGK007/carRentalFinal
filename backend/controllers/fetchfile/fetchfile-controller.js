const mongoose = require('mongoose');
const { getGFS } = require('../../utils/gridfs'); // Ensure this returns the initialized GridFS instance

const fetchFile = async (req, res) => {
    try {
        const fileId = req.params.id; // File ID from the URL
        console.log('Fetching file with ID:', fileId);

        // Get the GridFS instance
        const gfs = getGFS();
        
        // Ensure gfs is properly initialized
        if (!gfs) {
            console.error('GridFS instance is undefined or not initialized!');
            return res.status(500).json({ success: false, message: 'GridFS is not initialized' });
        }

        // Log to check if the GridFS instance has a 'files' collection
        console.log('GridFS instance:', gfs);
        console.log('Files collection exists:', gfs.s._filesCollection);

        // Fetch file metadata from the uploads.files collection
        const file = await gfs.s._filesCollection.findOne({ _id: new mongoose.Types.ObjectId(fileId) });

        // If file is not found, return 404
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        console.log('File found:', file);

        // Create a readable stream for the file data
        const readStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId));

        // Set the appropriate content type for the response
        res.set('Content-Type', file.contentType);

        // Pipe the file stream to the response
        readStream.pipe(res);

        // Handle any errors during file streaming
        readStream.on('error', (err) => {
            console.error('Error streaming the file:', err);
            res.status(500).json({ success: false, message: 'Error reading the file' });
        });
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = fetchFile;
