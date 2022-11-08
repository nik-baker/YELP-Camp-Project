const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next,) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



// THIS IS THE INDEX PAGE 
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

// THIS IS THE CREATE A NEW CAMPGROUND PAGE
router.get('/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}))

// THIS IS THE POST FOR CREATE A NEW CAMPGROUND
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// THIS IS THE SHOW PAGE FOR AN INDIVIDUAL CAMPGROUND
router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

// THIS IS THE EDIT PAGE
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

// THIS SUBMITS THE NEW DATA FROM EDIT TO THE DATA BASE 
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated a campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}));

// THIS IS THE DELETE FUNCTIONALITY 
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}))

module.exports = router;