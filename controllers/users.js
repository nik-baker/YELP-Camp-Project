const User = require('../models/user');

// Renders the Register Form 
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

// Registers a user
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds')
        });
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
};

// Render login form 
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

// Logs in user
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// Logs out user
module.exports.logout = async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
}