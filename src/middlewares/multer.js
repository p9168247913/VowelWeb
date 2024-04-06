const multer = require('multer');
const path = require('path');

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/product');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

// Initialize multer
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
});

module.exports = upload;
