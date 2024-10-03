import multer from 'multer';

// Set up multer to store files in memory
const storage = multer.memoryStorage();

// Multer middleware to handle different image uploads (logo, banner, and menu)
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allowed file types
    const extname = fileTypes.test(file.originalname.toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png)'));
    }
  },
}).fields([
  { name: 'logo', maxCount: 1 },    // Single logo upload
  { name: 'banner', maxCount: 1 },  // Single banner upload
  { name: 'menu', maxCount: 1 }     // Multiple menu uploads (up to 5)
]);

export default upload;
