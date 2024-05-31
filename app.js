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
const listingSchema = require("./schema");

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

const validateListing = (req,res,next)=>{
  const result = listingSchema.validate(req.body);
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

//creating new list
// app.get('/testListing',async(req,res)=>{
//     const newList = await Listing.create({
//         title:"New Villa",
//         description:"By the Beach",
//         price:1000,
//         location:"Goa",
//         country:"India"
//     })
//     res.send({status:"completed"})
// })

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