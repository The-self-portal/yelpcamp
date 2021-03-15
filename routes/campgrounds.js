const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchasync');
const {storage} = require('../cloudinary')
const {validateCampground , isLoggedIn , isAuthor} = require('../utils/schemavalidation');
const Camp = require('../controllers/campgrounds');
var multer  = require('multer');
var upload = multer({ storage });

router.route('/')
    .get(catchAsync(Camp.index))
    .post(isLoggedIn , upload.array('image'),  validateCampground , catchAsync(Camp.createCampground));

router.get('/new', isLoggedIn ,Camp.newCampground)

    router.route('/:id')
    .get(catchAsync(Camp.showCampground))
    .put(isLoggedIn , isAuthor, upload.array('image'),validateCampground  ,catchAsync(Camp.submitEdit))
    .delete(isAuthor , isLoggedIn , catchAsync(Camp.deleteCamp))


router.get('/:id/edit', isLoggedIn, isAuthor , catchAsync(Camp.showEdit))



module.exports = router ;

// CLOUDINARY_URL= {cloudinary: ' 415624921659866:C-TMQ55s3gwX1jSfbgCzV8owCgY@dalok9ito ' };