
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');

// Import models
const Cart = require('./models/cart-model');
const Consultant = require('./models/consultant-model');
const Health = require('./models/healthRep');
const MedicinalBlog = require('./models/medicinal-blog-model');
const News = require('./models/news-model');
const Order = require('./models/order-model');
const Seller = require('./models/seller-model');
const User = require('./models/user-model');

// Database Connection Function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://user:123@cluster0.xawpc.mongodb.net/petCare?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Import Routes
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const sellerRouter = require('./routes/seller');
const consultantRouter = require('./routes/consultant');

const app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Session Configuration
app.use(session({
  secret: "cat-keyboard" || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour session timeout
}));

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Conditionally apply file upload middleware
app.use((req, res, next) => {
  if (!req.originalUrl.startsWith('/admin')) {
    fileUpload()(req, res, next);
  } else {
    next();
  }
});

// Setup AdminJS
async function setupAdmin() {
  try {
    const AdminJS = (await import('adminjs')).default;
    const AdminJSExpress = (await import('@adminjs/express')).default;
    const AdminJSMongoose = (await import('@adminjs/mongoose')).default;

    AdminJS.registerAdapter({
      Database: AdminJSMongoose.Database,
      Resource: AdminJSMongoose.Resource,
    });

    const admin = new AdminJS({
      databases: [mongoose],
      rootPath: "/admin",
    });

    const router = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, router);

    console.log("AdminJS setup complete");
  } catch (error) {
    console.error("AdminJS setup error:", error);
  }
}

// Start Application
async function start() {
  try {
    await connectDB();
    await setupAdmin();

    // Define Routes
    app.use('/', adminRouter);
    app.use('/users', usersRouter);
    app.use('/seller', sellerRouter);
    app.use('/consultant', consultantRouter);

    // 404 Error Handling
    app.use((req, res, next) => next(createError(404)));

    // Global Error Handler
    app.use((err, req, res, next) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });

    console.log("Server is running...");
  } catch (error) {
    console.error("Startup error:", error);
  }
}

start();

// Register Handlebars Partials
hbs.registerPartials(__dirname + "/views/partials");

// Dynamic Layout Assignment
app.all("/*", (req, res, next) => {
  if (req.originalUrl.startsWith('/admin')) {
    next();
    return;
  }
  req.app.locals.layout = "layout/admin-layout";
  next();
});

app.all("/users/*", (req, res, next) => {
  req.app.locals.layout = "layout/userLayout";
  next();
});

app.all("/seller/*", (req, res, next) => {
  req.app.locals.layout = "layout/sellerLayout";
  next();
});

app.all("/consultant/*", (req, res, next) => {
  req.app.locals.layout = "layout/consultantLayout";
  next();
});

module.exports = app;
