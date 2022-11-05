// All of the Packages We Require
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');

// Data Depreciation
mongoose.set('useFindAndModify', false);

// Error Handling
const ExpressError = require('./utils/ExpressError');

// So we can make requests other than .get
const methodOverride = require('method-override');

// Lets us Call Files from Other Directories 
const { join } = require('path');

// Our Router Routes
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

// Connect to Mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// Connect to Mongo Database 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Turn on Express
const app = express();

// Setting our View Engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Turning on Our Configurations we Included
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));


// Using our Routes
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)



// THIS IS THE HOME PAGE
app.get('/', (req, res) => {
    res.render('home')
});




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, Something went Wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Listening on Port 3000')
})