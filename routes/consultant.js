const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'anazksunil2@gmail.com',  // Replace with your email
      pass: 'gefd cyst feti eztk'
  }
});
/* GET home page. */

const {
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
} = require("../controllers/consultant-controller");
const { checkConsultant } = require("../middlewares/checkConsultant")


router.get('/register', getConsultantSignupPage)
router.post('/register', doSignup)
router.get('/', getConsultantLoginPage)
router.post('/login', doLogin)
router.get('/consultantHome', checkConsultant, getConsultantHome)
router.get('/logout', logout)
router.get('/add-med-blogs', checkConsultant, addMedBlogPage)
router.post('/add-med-blogs', checkConsultant, addMedBlog)
router.get('/view-med-blogs', checkConsultant, getAllMedBlogs)
router.post('/add-news', checkConsultant,addMedNews)

router.get('/get-news-page',(req,res)=>{
        try {
            res.render('consultant/addNews')
        } catch (error) {
           console.log(error) 
        }
})

router.get('/getJobs',(req,res)=>{
    try {
        res.render('consultant/applyJob')
    } catch (error) {
       console.log(error) 
    }
})

router.post('/applyJob',(req,res)=>{
    try {
        console.log(req.body)
        let user = req.body
        const mailOptions = {
            from: 'Pet Care System',
            to: "anazksunil2@gmail.com",
            subject: "Job  Request",
            text: `Hello ${user.fullName}, Requested To a job  email ${user.email} contact  ${user.email} skills ${user.skills} experience ${user.experience} cover letter ${user.coverLetter}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ error: "Failed to send email" });
            } else {
                console.log("Email sent:", info.response);
                res.redirect("/users/home")
            }
        });
        res.render('consultant/applyJob')
    } catch (error) {
       console.log(error) 
    }
})

module.exports = router;