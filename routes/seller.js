var express = require('express');
var router = express.Router();
var con = require('../config/config');
var nodemailer = require('nodemailer');
/* GET home page. */

const {
  getSellerLoginPage,
  getSellerSignupPage,
  doLogin,
  doSignup,
  logout,
  getSellerHomePage,
  getAddProductPage,
  addNewProduct,
  getSellerOrders,
  shipOrder,
  getShippedOrders,
  getApprovedProducts,
  getRejectedProducts
} = require("../controllers/seller-controller")
const { checkSeller } = require("../middlewares/checkSeller")


router.get('/', getSellerLoginPage)
router.get('/sellerHome', checkSeller, getSellerHomePage)
router.get('/register', getSellerSignupPage)
router.post('/register', doSignup)

router.post('/login', doLogin)
router.get('/logout', logout)

router.get('/addProduct', checkSeller, getAddProductPage)
router.post('/addProduct', checkSeller, addNewProduct)
router.get("/orders", checkSeller, getSellerOrders)
router.get("/shipped-orders", checkSeller, getShippedOrders)

router.get('/shipped/:id', checkSeller, shipOrder)
router.get("/approved-products", checkSeller, getApprovedProducts)
router.get("/rejected-products", checkSeller, getRejectedProducts)

module.exports = router;




































// router.get('/deliver/:id/:mail', (req, res) => {
//   var mail = req.params.mail;
//   var id = req.params.id;
//   sql = "update orders set status = 'deliver today' where id = ?"
//   con.query(sql, [id], (err, result) => {
//     if (err) {
//       console.log(err)
//     } else {

//       let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'greencartkottayam@gmail.com',
//           pass: 'ashwinbabu@123',
//         },
//         tls: {
//           rejectUnauthorized: false,
//         },
//       });
//       let mailOptions = {
//         from: 'seed cartTeam',
//         to: mail,
//         subject: 'Delever today',
//         text: `your Order will Deliver today item will reach you as soon as possible stay happy with Greencart thank you!!!!`
//       };
//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });
//       res.redirect('/seller/sellerHome')
//     }
//   })
// })

// router.post('/addblog', (req, res) => {
//   var image_name;
//   if (!req.files) return res.status(400).send("no files were uploaded.");

//   var file = req.files.image;
//   var image_name = file.name;
//   let sql = "INSERT INTO blog SET ?";

//   console.log(file)
//   console.log(image_name);
//   if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif"
//   ) {
//     file.mv("public/images/blogs/" + file.name, function (err) {
//       if (err) return res.status(500).send(err);
//       console.log(image_name);

//       let data = {

//         sellerID: req.session.user.id,
//         discription: req.body.discription,
//         img: image_name,
//       };
//       console.log(data)
//       con.query(sql, data, (err, result) => {
//         if (err) {
//           console.log(err)
//         } else {
//           res.redirect('/seller/sellerHome')

//         }
//       })
//     })
//   }
// })
// router.get('/blogView', (req, res) => {
//   // sql5="SELECT  * from blog and SUM(set_Like) as sum FROM likes;"
//   var user = req.session.user;

//   sql = "select * from blog "
//   var likesTotal;
//   con.query(sql, (err, result) => {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(err)

//       res.render('seller/blogs', { blog: result, user })

//     }
//   })
// })
// router.get('/like/:id', (req, res) => {
//   var usermail = req.session.user.email;
//   var pid = req.params.id;
//   var data = {
//     usermail: usermail,
//     pid: pid

//   }
//   sql = "select * from likes where usermail = ? and pid = ?"
//   con.query(sql, [usermail, pid], (err, result) => {
//     if (err) {
//       console.log(err)
//     } else {
//       if (result.length > 0) {
//         var message = "Liked"
//         //already liked
//         console.log("liked already")
//         res.redirect('/seller/blogView')

//       } else {
//         sql2 = "insert into likes set ?"
//         con.query(sql2, data, (err, row) => {
//           if (err) {
//             console.log(err)
//           } else {
//             console.log("liked now")
//             var getsum = "SELECT SUM(set_Like) as sum FROM likes where  pid = ? ;"
//             con.query(getsum, [pid], (err, getLikes) => {
//               if (err) {
//                 console.log(err)
//               } else {
//                 var likes = getLikes[0].sum;
//                 console.log(getLikes)
//                 var updateSql = "update blog set likes = ? where id = ?"
//                 con.query(updateSql, [likes, pid], (err, result) => {
//                   if (err) {
//                     console.log(err)
//                   } else {
//                     res.redirect('/seller/blogView')
//                   }
//                 })
//               }
//             })
//             // res.redirect('/seller/blogView')
//           }
//         })
//       }
//     }
//   })

// })
// router.get('/application', (req, res) => {
//   sql = "select * from jobs"
//   var user = req.session.user;
//   con.query(sql, (err, result) => {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(result)
//       res.render('seller/application', { applications: result, user, homepage: true })
//     }
//   })
// })

// router.get('/invite/:mail', (req, res) => {
//   var usermail = req.params.mail;
//   var seller = req.params.seller;
//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       //althafhussain816@gmail.com
//       user: 'greencartkottayam@gmail.com',
//       pass: 'ashwinbabu@123',
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
//   let mailOptions = {
//     from: 'seed cartTeam',
//     to: usermail,
//     subject: 'Invitation',
//     text: `you are invited by ${seller} to join with our team plese contact to the given mail with your biodata thank you!!!!!`
//   };
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });

// })
// router.post('/addoffer', (req, res) => {
//   var image_name;
//   if (!req.files) return res.status(400).send("no files were uploaded.");

//   var file = req.files.uploaded_image;
//   var image_name = file.name;
//   let sql = "INSERT INTO offer SET ?";

//   console.log(file)
//   console.log(image_name);
//   if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif"
//   ) {
//     file.mv("public/images/offer/" + file.name, function (err) {
//       if (err) return res.status(500).send(err);
//       console.log(image_name);

//       let data = {

//         mail: req.session.user.email,
//         img: image_name
//       };
//       console.log(data)
//       con.query(sql, data, (err, result) => {
//         if (err) {
//           console.log(err)
//         } else {
//           res.redirect('/seller/sellerHome')

//         }
//       })
//     })
//   }
// })
// var msg = "Iteam can not be delted"
// router.get('/delte/:id', (req, res) => {
//   var id = req.params.id;


//   sql = `Delete from product where id = ${id}`
//   con.query(sql, (err, result) => {
//     if (err) {
//       console.log(err)
//     } else {
//       res.redirect('/seller/sellerHome')
//     }
//   })

// })
// router.post('/search', (req, res) => {
//   var data = req.body.cata;
//   sql = "select * from product where catagory = ?"
//   con.query(sql, [data], (err, result) => {
//     if (err) {
//       console.log(err)
//     } else {
//       var user = req.session.user;
//       res.render('seller/catagory', { data: result, user })
//     }
//   })

// })

