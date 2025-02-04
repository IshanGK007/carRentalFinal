// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;

const multer = require('multer');

// Use memoryStorage to store files in memory (you can also use diskStorage if needed)
const upload = multer({ storage: multer.memoryStorage() }).single('image'); // 'image' is the field name in the form

module.exports = upload; // This should export the multer middleware function

