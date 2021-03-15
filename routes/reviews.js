const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchasync');
const {isLoggedIn,validateReview , isReviewAuthor} = require('../utils/schemavalidation');
const {newReview,deleteReview} = require('../controllers/review');

router.post('/',isLoggedIn,validateReview,catchAsync(newReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(deleteReview))

module.exports = router ;