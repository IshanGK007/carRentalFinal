// const { uploadFileToGridFS } = require('../../utils/gridfs'); // Ensure correct import

// const uploadFile = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: 'No file uploaded' });
//         }

//         // Get the file details from req.file
//         const { buffer, originalname, mimetype } = req.file;

//         // Upload the file to GridFS
//         const uploadedFile = await uploadFileToGridFS(buffer, originalname, mimetype);

//         res.status(200).json({
//             success: true,
//             message: 'File uploaded successfully',
//             file: uploadedFile, // Return the file info from GridFS
//         });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };const { uploadFileToGridFS } = require('../../utils/gridfs');



const { uploadFileToGridFS } = require('../../utils/gridfs');

const uploadFile = async (req, res) => {
    try {
        // Ensure the file exists in the request
        if (!req.file) {
            console.error('No file uploaded in request:', req.body, req.files);
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { buffer, originalname, mimetype } = req.file;

        // Log received file details for debugging
        console.log('File details:', { originalname, mimetype, bufferLength: buffer.length });

        // Check if the buffer exists and has data
        if (!buffer || buffer.length === 0) {
            console.error('File buffer is empty:', req.file);
            return res.status(400).json({ success: false, message: 'Empty file buffer' });
        }

        // Upload the file to GridFS
        const uploadedFile = await uploadFileToGridFS(buffer, originalname, mimetype);

        // Ensure the uploaded file contains the necessary metadata
        if (!uploadedFile || !uploadedFile._id) {
            return res.status(500).json({ success: false, message: 'File upload failed, no file metadata' });
        }

        // Send successful response with file metadata
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            file: {
                id: uploadedFile._id, // Return the file's ID
                filename: uploadedFile.filename, // Return the filename
                contentType: uploadedFile.contentType, // Return the content type
            },
        });
    } catch (error) {
        console.error('Error uploading file:', error);  // Log error
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = uploadFile;
