module.exports = {
    checkUser: (req, res, next) => {
        if (req.session.user) {
            // console.log(req.session.user)
            next();
        } else {
            res.redirect("/users/login")
        }
    }
}
