const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const { connectDB } = require("./connection");
const { wrapAsync } = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const {listingSchema,reviewSchema} = require("./schema");
const Review = require("./models/review");

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


app.get("/", (req, res) => {
  res.send("Hey");
});


//listing route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

//create new list
app.get("/listings/new", wrapAsync(async (req, res) => {
  res.render("listings/new.ejs");
}));

//schema validation for listing
const validateListing = (req,res,next)=>{
  const result = listingSchema.validate(req.body);
  if(result.error){
    throw new expressError(400,result.error)
  }else{
    next()
  }
}

//schema validation for review
const validateReview = (req,res,next)=>{
  const result = reviewSchema.validate(req.body);
  if(result.error){
    throw new expressError(400,result.error)
  }else{
    next()
  }
}

//handling post request for create
app.post(
  "/listings/new",validateListing,
  wrapAsync(async (req, res, next) => {
    
    const { title, description, image, price, country, location } = req.body;
    //checking for custom error
    const newList = await Listing.create({
      title,
      description,
      image,
      price,
      country,
      location,
    });
    res.redirect("/listings");
  })
);

//edit get route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const id = req.params.id;
  const list = await Listing.findById(id);
  res.render("listings/edit.ejs", { list });
}));

//handling put route
app.patch("/listings/:id/edit",validateListing, wrapAsync(async (req, res) => {
  const id = req.params.id;
  const { title, description, image, price, country, location } = req.body;
  const editedUser = await Listing.findByIdAndUpdate(
    { _id: id },
    { title, description, image, price, country, location }
  );
  res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id/delete", wrapAsync(async (req, res) => {
  const id = req.params.id;
  const deletedList = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
  const id = req.params.id;
  const list = await Listing.findById(id);
  res.render("listings/show.ejs", { list });
}));


//handling post request for reviews and maintaining relationship between listings and review
app.post('/listings/:id/reviews',validateReview,wrapAsync(async (req,res)=>{
  const {rating,review} = req.body;
  const id = req.params.id;
  const rev = await Review.create({
    rating,
    comment:review,
  })
  //updating the listing by providing its particular review's id and maintaining relationship 
  const listing = await Listing.findById(id);
  listing.reviews.push(rev);
  await listing.save();
  
  // const updatedListing = await Listing.findById(id).populate('reviews').exec();
  // console.log((updatedListing));
  res.redirect(`/listings/${id}`)
}))



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
