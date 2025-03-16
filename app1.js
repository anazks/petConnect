// First, convert your setup to use async/await with dynamic imports
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require("handlebars");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const connectDB = require("./db/connection");
require("dotenv").config();

const indexRouter = require('./routes/index');
const companyRouter = require("./routes/company");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//iff helper
hbs.registerHelper('iff', function (a, operator, b, opts) {
  var bool = false;
  switch (operator) {
    case '==':
      bool = a == b;
      break;
    case '>':
      bool = a > b;
      break;
    case '<':
      bool = a < b;
      break;
    default:
      throw "Unknown operator " + operator;
  }
  if (bool) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } //max age 1 hour
}));

async function setupAdmin() {
  try {
    // Import AdminJS modules
    const AdminJS = await import('adminjs');
    const AdminJSExpress = await import('@adminjs/express');
    const AdminJSMongoose = await import('@adminjs/mongoose');
    const mongoose = require('mongoose');

    // Register the adapter correctly
    AdminJS.default.registerAdapter({
      Database: AdminJSMongoose.Database,
      Resource: AdminJSMongoose.Resource,
    });
    
    // Create AdminJS instance
    const admin = new AdminJS.default({
      databases: [mongoose],
      rootPath: "/admin",
    });

    // Create the router
    const router = AdminJSExpress.default.buildRouter(admin);
    app.use(admin.options.rootPath, router);
    
    console.log("AdminJS setup complete");
  } catch(error) {
    console.error("AdminJS setup error:", error);
    // Print the full stack trace to see where the error is coming from
    console.error(error.stack);
  }
}
async function start() {
  try {
    // Connect to the database
    let url = "mongodb+srv://anazks:123@cluster0.jxpil.mongodb.net/betaPortal?retryWrites=true&w=majority";
    await connectDB(url);
    console.log("DB connected");
    
    // Setup AdminJS after DB connection
    await setupAdmin();
    
    // Setup routes
    app.use('/', indexRouter);
    app.use("/company", companyRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    
  } catch (error) {
    console.error("Startup error:", error);
  }
}

// Start the application
start();

module.exports = app;