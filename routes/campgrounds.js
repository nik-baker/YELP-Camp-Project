const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const Campground = require('../models/campground');

// THIS IS THE INDEX PAGE & POST FOR CREATE A NEW CAMPGROUND
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// THIS IS THE CREATE A NEW CAMPGROUND PAGE
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// THIS IS THE SHOW PAGE FOR AN INDIVIDUAL CAMPGROUND &  EDIT  & DELETE FUNCTIONALITY 
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;