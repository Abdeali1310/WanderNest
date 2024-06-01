const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const { connectDB } = require("./connection");
const expressError = require("./utils/expressError");

//routes
const listingRoute = require('./routes/listingRoute')
const reviewRoute = require('./routes/reviewRoute')

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

//for ejs-mate
app.engine("ejs", ejsMate);

//Home Route
app.get("/", (req, res) => {
  res.send("Hey");
});

//Routes
//Listing Route
app.use('/listings',listingRoute)
app.use('/listings/:id/reviews',reviewRoute)

app.use((req,res,next)=>{
  next(new expressError(404,'Page Not Found'))
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
