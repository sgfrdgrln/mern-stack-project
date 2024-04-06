const multer = require('multer');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const filename = `${year}-${month}-${day}-${hours}${minutes}${seconds}-${file.originalname}`;
        cb(null, filename); // Generate a unique filename with current date prefix
    }
});

// Create the Multer instance
const upload = multer({ storage: storage });

module.exports = upload;
