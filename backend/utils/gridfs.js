// const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');

// // Initialize GridFS
// let gfs;

// const initGridFS = () => {
//     // Access the Mongoose connection directly
//     const conn = mongoose.connection; // Access the mongoose.connection object

//     if (!conn.readyState) {
//         throw new Error("Mongoose connection is not established");
//     }

//     // Initialize GridFS with the connection object
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads'); // Specify the collection name (e.g., 'uploads')
// };

// // Correct way to use ObjectId in GridFS queries
// const getFileById = (id) => {
//     const fileId = mongoose.Types.ObjectId(id);  // Use mongoose.Types.ObjectId

//     return gfs.files.findOne({ _id: fileId });
// };

//v2
// const mongoose = require('mongoose');
// const { GridFSBucket } = require('mongodb'); // Native MongoDB driver

// let gfsBucket;

// // Initialize GridFS using MongoDB native driver
// const initGridFS = () => {
//     const conn = mongoose.connection; // Access the mongoose.connection object

//     if (!conn.readyState) {
//         throw new Error("Mongoose connection is not established");
//     }

//     const db = conn.db; // Get the MongoDB client instance

//     // Initialize GridFSBucket using the native MongoDB driver
//     gfsBucket = new GridFSBucket(db, {
//         bucketName: 'uploads', // Specify the collection name for GridFS
//     });
// };

// // Function to upload a file to GridFS
// const uploadFileToGridFS = (fileBuffer, fileName, mimetype) => {
//     return new Promise((resolve, reject) => {
//         if (!gfsBucket) {
//             return reject(new Error('GridFSBucket is not initialized.'));
//         }

//         // Create an upload stream to write the file to GridFS
//         const uploadStream = gfsBucket.openUploadStream(fileName, {
//             contentType: mimetype,
//         });

//         console.log('Uploading file:', fileName); // Log the file name

//         // Write the file buffer to GridFS
//         uploadStream.end(fileBuffer);

//         // Log when upload is finished
//         uploadStream.on('finish', (file) => {
//             if (file && file._id) {
//                 console.log('File uploaded successfully:', file); // Log the file object after upload
//                 resolve(file);  // Resolve with the file object
//             } else {
//                 reject(new Error('File upload failed. No file object returned.'));
//             }
//         });

//         // Error handling
//         uploadStream.on('error', (error) => {
//             console.error('Error uploading file:', error);  // Log the error
//             reject(error);  // Reject if an error occurs during the upload
//         });
//     });
// };

// // Function to retrieve a file by its ID
// const getFileById = (id) => {
//     return new Promise((resolve, reject) => {
//         const fileId = mongoose.Types.ObjectId(id);  // Convert the id to a valid ObjectId

//         gfsBucket.openDownloadStream(fileId)
//             .pipe(resolve)
//             .on('error', (error) => reject(error));
//     });
// };

// module.exports = { initGridFS, uploadFileToGridFS, getFileById };

const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gfs;
let bucket;

const initGridFS = () => {
    if (gfs) {
        console.log('GridFS already initialized.');
        return;
    }

    const db = mongoose.connection.db; // Get MongoDB database connection
    bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    gfs = bucket;
    console.log('GridFS initialized successfully.');
};

const getGFS = () => {
    if (!gfs) {
        throw new Error('GridFS is not initialized. Call initGridFS first.');
    }
    return gfs;
};

const uploadFileToGridFS = (buffer, filename, contentType) => {
    return new Promise((resolve, reject) => {
        if (!gfs) {
            return reject(new Error('GridFS is not initialized.'));
        }

        const uploadStream = gfs.openUploadStream(filename, { contentType });

        uploadStream.end(buffer);

        uploadStream.on('finish', async () => {
            console.log('GridFS upload finished, retrieving file metadata...');
            try {
                // Fetch the file metadata from the database using its filename
                const file = await mongoose.connection.db
                    .collection('uploads.files')
                    .findOne({ filename });

                if (!file) {
                    return reject(new Error('File uploaded but metadata could not be retrieved.'));
                }

                console.log('Retrieved file metadata:', file);
                resolve(file);
            } catch (err) {
                console.error('Error fetching file metadata:', err);
                reject(err);
            }
        });

        uploadStream.on('error', (err) => {
            console.error('GridFS Upload Error:', err);
            reject(err);
        });
    });
};

module.exports = {
    initGridFS,
    getGFS,
    uploadFileToGridFS,
};
