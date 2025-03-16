const ConsultantModel = require("../models/consultant-model");
const medBlogModel = require("../models/medicinal-blog-model");
const newsModel = require('../models/news-model')
const bcrypt = require("bcrypt");



const getConsultantHome = async (req, res) => {
    try {
        let { consultant } = req.session;
        let medBlogs = await medBlogModel.find({ consultantId: consultant._id });
        res.render('consultant/home', { medBlogs, consultant });
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/consultant")
    }
}

const getConsultantSignupPage = function (req, res, next) {
    res.render('consultant/register', { homepage: true })
}
const doSignup = async (req, res) => {
    try {
        console.log(req.body, req.body.password);
        let { password } = req.body;
        req.body.password = await bcrypt.hash(password, 10)
        const consultant = await ConsultantModel.create(req.body);
        res.redirect('/consultant')
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform signup Please Retry (with a new email) !!!";
        res.redirect("/consultant/register")
    }

}

const getConsultantLoginPage = (req, res) => {
    res.render('consultant/login', { homepage: true })
}
const doLogin = async (req, res) => {
    try {
        console.log(req.body, req.body.password);
        let { password } = req.body;
        const consultant = await ConsultantModel.findOne({ email: req.body.email });
        if (consultant) {
            const exist = await bcrypt.compare(password, consultant.password);
            if (exist) {
                req.session.consultant = consultant;
                return res.redirect("/consultant/consultantHome");
            }
        }
        req.session.alertMessage = "Invalid consultant Credentials";
        res.redirect("/consultant/login");
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/consultant/login")
    }
}
const logout = (req, res) => {
    req.session.consultant = false;
    res.redirect('/')
}
const addMedBlogPage = (req, res) => {
    res.render('consultant/addMedBlog', { homepage: true })
}
const addMedBlog = async (req, res) => {
    try {
        let { userName, _id } = req.session.consultant;
        req.body.consultantId = _id;
        req.body.consultantName = userName;
        req.body.date = new Date().toLocaleDateString();
        let medBlog = await medBlogModel.create(req.body);
        let { image } = req.files;
        image.mv('./public/images/medBlog/' + medBlog._id + ".jpg").then((err) => {
            if (!err) {
                req.session.alertMessage = " successfully Added new information"
                return res.redirect('/consultant/consultantHome')
            }
            res.redirect('/consultant/consultantHome')
        })
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/consultant")
    }
}
const addMedNews = async (req, res) => {
    try {
        let { userName, _id } = req.session.consultant;
        req.body.consultantId = _id;
        req.body.consultantName = userName;
        req.body.date = new Date().toLocaleDateString();
        let news = await newsModel.create(req.body);
        let { image } = req.files;
        image.mv('./public/images/news/' + news._id + ".jpg").then((err) => {
            if (!err) {
                req.session.alertMessage = " successfully Added new information"
                return res.redirect('/consultant/consultantHome')
            }
            res.redirect('/consultant/consultantHome')
        })
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/consultant")
    }
}
const getAllMedBlogs = async (req, res) => {
    try {
        let { consultant } = req.session
        let medBlogs = await medBlogModel.find({ consultantId: consultant._id, status: "approved" });
        res.render("consultant/viewMedBlogs", { title: "Approved Medicinal Informations", medBlogs, consultant })
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/consultant")
    }
}

module.exports = {
    getConsultantLoginPage,
    getConsultantSignupPage,
    doLogin,
    doSignup,
    logout,
    getConsultantHome,
    addMedBlogPage,
    addMedBlog,
    getAllMedBlogs,
    addMedNews
}