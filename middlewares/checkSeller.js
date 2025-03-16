module.exports = {
    checkSeller: (req, res, next) => {
        if (req.session.seller) {
            console.log(req.session.seller)
            next();
        } else {
            res.redirect("/seller")
        }
    }
}