const UserModel = require("../models/user-model");
const ProductModel = require('../models/product-model')
const medBlogModel = require("../models/medicinal-blog-model");
const CartModel = require('../models/cart-model');
const OrderModel = require('../models/order-model');
const bcrypt = require("bcrypt");
const productModel = require("../models/product-model");
const SellerModel = require('../models/seller-model')
const nodemailer = require('nodemailer');
const { use } = require("../routes/users");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'anazksunil2@gmail.com',  // Replace with your email
      pass: 'gefd cyst feti eztk'
  }
});
const getUserHomePage = async function (req, res, next) {
    try {
        let products = await ProductModel.find({ status: "approved" }).limit(8);
        let medBlogs = await medBlogModel.find({ status: "approved" }).sort({ date: 1 }).limit(4)
        let sellers = await SellerModel.find({})
        let { user } = req.session;
        let CartTotal = 0;
        res.render('user/home', { product: products, user, CartTotal, medBlogs,sellers} );
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/users/login")
    }
}

const getUserLoginPage = function (req, res, next) {
    res.render("user/userLogin", { homepage: true })
}


const getUserSignupPage = function (req, res, next) {
    res.render("user/userReg", { homepage: true })
}

const doLogin = async (req, res) => {
    console.log(req.body);
    try {
        console.log(req.body, req.body.password);
        let { password } = req.body;
        const user = await UserModel.findOne({ email: req.body.email });
        if (user) {
            const exist = await bcrypt.compare(password, user.password);
            if (exist) {
                req.session.user = user;
                return res.redirect("/users/home");
            }
        }
        req.session.alertMessage = "Invalid user Credentials";
        res.redirect("/users/login");
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/users/login")
    }
}

const doSignup = async (req, res) => {
    console.log(req.body);
    try {
        console.log(req.body, req.body.password);
        let { password } = req.body;
        req.body.password = await bcrypt.hash(password, 10)
        const user = await UserModel.create(req.body);
        res.redirect('/users/login')
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform signup Please Retry (with a new email) !!!";
        res.redirect("/users/signup")
    }
}

const logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}

const getAllMedBlogs = async (req, res) => {
    try {
        let { user } = req.session;
        let medBlogs = await medBlogModel.find({ status: "approved" }).sort({ date: 1 })
        res.render("user/blogsList", { user, medBlogs })
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform signup Please Retry (with a new email) !!!";
        res.redirect("/users/signup")
    }
}

const getAllProducts = async (req, res) => {
    try {
        let { user } = req.session;
        let products = await ProductModel.find({ status: "approved" })
        res.render("user/productList", { user, products })
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform signup Please Retry (with a new email) !!!";
        res.redirect("/users/login")
    }
}

const addToCart = async (req, res) => {
    //check if cart exist 
    let { user } = req.session;
    let { id } = req.params;
    try {
        let product = await ProductModel.findOne({ _id: id });
        product.id = id;
        let obj = {
            item: product,
            quantity: 1
        }
        let cart = await CartModel.findOne({ userId: user._id })
        if (cart) {
            console.log("cart already exist");
            let proExist = cart.products.findIndex(product => product.item._id == id)
            console.log(proExist);
            if (proExist != -1) {
                await CartModel.findOneAndUpdate({
                    "products.item._id": product._id
                },
                    {
                        $inc: { 'products.$.quantity': 1 }
                    }
                )
                res.redirect("/users/cart")
            } else {
                await CartModel.findOneAndUpdate({ userId: user._id },
                    {
                        $push: {
                            products: obj
                        }
                    }
                )
                res.redirect("/users/cart")
            }
        } else {
            let cartObj = {
                userId: user._id,
                products: [obj]
            }
            console.log("cart", cartObj)
            await CartModel.create(cartObj);
            res.redirect("/users/cart")
        }
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform operation Please Retry!!!";
        res.redirect("/users/home")
    }
}
const getCartProducts = async (req, res) => {
    try {
        let { user } = req.session
        let { _id } = req.session.user
        let myCart = await CartModel.findOne({ userId: _id })
        let relatedProducts = new Set() // Using a Set to avoid duplicates
        
        if (myCart) {
            console.log(myCart.products)
            let total = 0;
            let totalMRP = 0
          
            // Collect all related products from each cart item
            for (let p of myCart.products) {
                console.log(p.item.relatedTo, "0------")
                
                // Add each related product to the Set
                if (Array.isArray(p.item.relatedTo)) {
                    // If relatedTo is already an array
                    p.item.relatedTo.forEach(id => relatedProducts.add(id))
                } else if (typeof p.item.relatedTo === 'string') {
                    // If relatedTo is a comma-separated string
                    p.item.relatedTo.split(',').forEach(id => relatedProducts.add(id.trim()))
                }
                
                total += (parseInt(p.item.price) * parseInt(p.quantity))
                totalMRP += (parseInt(p.item.mrp) * parseInt(p.quantity))
            }
            
            // Convert Set back to Array for passing to the view
            const relatedProductsArray = Array.from(relatedProducts)
            console.log(relatedProductsArray, "All related products collected")
            
            // Find the actual related product documents from your database
            // Assuming you have a ProductModel that stores your products
            const recommendedProducts = await ProductModel.find({
                _id: { $in: relatedProductsArray },
                _id: { $nin: myCart.products.map(p => p.item._id) } // Exclude products already in cart
            }).limit(3) // Limit to 3 recommended products
                console.log(recommendedProducts,"recommendedProducts")
            let saved = totalMRP - total;
            let allProducts = await productModel.find({})
            console.log(allProducts,"allproducts....")
            let newProducts = allProducts.filter(product => 
                relatedProductsArray.includes(product.relatedTo)
            );
            
            console.log(newProducts, "Filtered related products....");
            res.render("user/cart", { 
                products: myCart.products, 
                user, 
                total, 
                totalMRP, 
                saved,
                newProducts // Pass the recommended products to the view
            })
        } else {
            res.render("user/cart", { products: false, user })
        }
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform signup Please Retry!!!";
        res.redirect("/users/home")
    }
}
const removeCartProduct = async (req, res) => {
    try {
        let { _id } = req.session.user;
        let { id } = req.params
        await CartModel.findOneAndUpdate({ userId: _id },
            {
                $pull: {
                    products: {
                        'item._id': id
                    }
                }
            }
        )
        res.redirect("/users/cart")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform signup Please Retry!!!";
        res.redirect("/users/home")
    }
}

const goToPayment = async (req, res) => {
    try {
        let { id, qty } = req.params;
        let { _id, userName, email, mobile } = req.session.user
        let product = await ProductModel.findOne({ _id: id })
        let orderObj = {
            productId: product._id,
            productName: product.productName,
            sellerId: product.sellerId,
            sellerName: product.sellerName,
            buyerId: _id,
            buyerName: userName,
            buyerPhone: mobile,
            buyerEmail: email,
            date: new Date().toLocaleDateString(),
            quantity: qty,
            totalPrice: parseFloat(product.price) * parseFloat(qty),
            status: "pending"
        }
        let order = await OrderModel.create(orderObj)
        console.log(order._id)
        res.render('user/payment', { homepage: true, total: orderObj.totalPrice, orderId: order._id })
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform signup Please Retry!!!";
        res.redirect("/users/home")
    }
}

const confirmPayment = async (req, res) => {
    try {
        let { orderId } = req.body
        let order = await OrderModel.findOneAndUpdate({ _id: orderId }, {
            $set: { status: "Order Placed" }
        })
        await CartModel.findOneAndUpdate({ userId: req.session.user._id }, { $set: { products: [] } })
        res.redirect("/users/home")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform request Please Retry!!!";
        res.redirect("/users/home")
    }
}

const getMyOrders = async (req, res) => {
    try {
        let { user } = req.session;
        let orders = await OrderModel.find({ buyerId: user._id})
        res.render('user/myorders', { product: orders, user, homepage: true })
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform request Please Retry!!!";
        res.redirect("/users/home")
    }
}

const addLike = async (req, res) => {
    try {
        let { user } = req.session;
        let { id } = req.params;

        console.log(user, "user session...");

        const mailOptions = {
            from: 'Integrated Pat Care System',
            to: id,
            subject: "Your Account Has Been Activated",
            text: `Hello ${user.userName}, Requested To Visit your Pet Center contact ${user.mobile}`
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

    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const searchProduct = async (req, res) => {
    try {
        let { search } = req.body;
        let { user } = req.session
        let products = await ProductModel.find({ productName: { $regex: search }, status: "approved" })
        res.render("user/productList", { user, products })
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't perform signup Please Retry (with a new email) !!!";
        res.redirect("/users/home")
    }
}
const getFestivalItems = async (req, res) => {
    try {
        console.log("--- Festival API Called ---");

        let festival = req.params.festival?.toLowerCase(); // Normalize input
        console.log("Requested Festival:", festival);

        if (!festival) {
            return res.status(400).json({ message: "Festival name is required" });
        }

        let productList = await productModel.find({}); // Fetch all products
        console.log("Total Products Fetched:", productList.length);

        let festivalProducts = {
            onam: ['saree', 'dhoti', 'mund','Black Shirt'],
            christmas: ['red shirt', 'white shirt'],
            ramadan: ['kurti', 'churidar']
        };

        if (!festivalProducts[festival]) {
            return res.status(400).json({ message: "Invalid festival name" });
        }

        let selectedProducts = productList.filter(pro =>
            festivalProducts[festival].some(festItem =>
                pro.productName.toLowerCase().includes(festItem.toLowerCase())
            )
        );

        console.log("Filtered Products:", selectedProducts.length);
        return res.json(selectedProducts); // Send response

    } catch (error) {
        console.error("Error fetching festival items:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = {
    getUserHomePage,
    getUserLoginPage,
    getUserSignupPage,
    doLogin,
    doSignup,
    logout,
    getAllProducts,
    getAllMedBlogs,
    addToCart,
    getCartProducts,
    removeCartProduct,
    goToPayment,
    confirmPayment,
    getMyOrders,
    addLike,
    searchProduct,
    getFestivalItems
}