module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in')
        //return, otherwiser the code below will still run
        return res.redirect('/login')
    }
    next()
}