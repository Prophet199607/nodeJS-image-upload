const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 10) + path.extname(file.originalname).toLowerCase());
    }
})

// init upload
const upload = multer({
    storage,
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

// check file type
function checkFileType(file, cb) {
    // allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mimetype
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb('Error: Images Only');
    }
}

// init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));


const PORT = 3000;

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file === undefined) {
                res.render('index', { msg: 'Error: No file selected' });
            } else {
                res.render('index', { msg: 'Success: File Uplaoded', file: `uploads/${req.file.filename}` })
            }
        }
    })
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})