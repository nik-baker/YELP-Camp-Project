const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const Campground = require('../models/campground');
const Review = require('../models/review')
const reviews = require('../controllers/reviews')


// THIS IS THE POST FOR CREATE A NEW CAMPGROUND REVIEW
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// THIS IS THE DELETE FUNCTIONALITY FOR EACH REVIEW 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;