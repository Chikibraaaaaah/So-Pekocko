const multer = require('multer');

// Configuration de multer qui a besoin de deux choses. Une destination pour les fichiers qu'il va recevoir, ainsi qu'un nom

const MIME_TYPE = {
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg',
    'image/png' : 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join();
        const extansion = MIME_TYPE[file.mimetype];
        callback(null, name + '.' + Date.now() + '.' + extansion) 
    }
});

module.exports = multer({storage: storage}).single('image');