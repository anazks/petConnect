module.exports = {
    checkConsultant: (req, res, next) => {
        if (req.session.consultant) {
            console.log(req.session.consultant)
            next();
        } else {
            res.redirect("/consultant")
        }
    }
}