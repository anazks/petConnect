

module.exports = {
    checkAdmin: (req, res, next) => {
        if (req.session.admin) {
            // console.log(req.session.admin)
            next();
        } else {
            res.redirect("/login")
        }
    }
}