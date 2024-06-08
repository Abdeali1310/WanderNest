const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require('express-session')
const flash = require('connect-flash')

const { connectDB } = require("./connection");
const expressError = require("./utils/expressError");

//routes
const listingRoute = require('./routes/listingRoute')
const reviewRoute = require('./routes/reviewRoute');
const userRoute = require('./routes/userRoute')
const categoryRoutes = require('.//routes/categoryRoutes')
//passport
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require('passport-local');

require("dotenv").config();

//MongoDB connection
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//parsing middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

//session
const sessionOptions = {
  secret:"mySecretKey",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 1 * 24 * 60 * 60 * 1000,
    maxAge:1 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}
app.use(session(sessionOptions))
//flash
app.use(flash())

//for passport
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

//serialize and deserialize
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//for ejs-mate
app.engine("ejs", ejsMate);

//Home Route
app.get("/", (req, res) => {
  res.redirect('/listings')
});

//middleware locals
app.use((req,res,next)=>{
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.currentUser = req.user;
  next();
})



//Routes
app.use('/listings',listingRoute)
app.use('/listings/:id/reviews',reviewRoute)
app.use('/user',userRoute)
app.use("/category",categoryRoutes)

app.use((req,res,next)=>{
  req.flash('error','Page not Found!\nRedirected to Explore Page')
  setTimeout(() => {
    res.redirect('/listings')
  }, 1500);
})

//error handling middleware
app.use((err,req,res,next)=>{
  const {status = 500,message = 'Something went wrong!'} = err;
  res.status(status).render('error.ejs',{message})
})


const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server is running on port 3000 ");
});
