const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const { connectDB } = require("./connection");
const { wrapAsync } = require("./utils/wrapAsync");
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

//listing route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

//create new list
app.get("/listings/new", async (req, res) => {
  res.render("listings/new.ejs");
});

//handling post request for create
app.post(
  "/listings/new",
  wrapAsync(async (req, res, next) => {
    const { title, description, image, price, country, location } = req.body;
    const newList = await Listing.create({
      title,
      description,
      image,
      price,
      country,
      location,
    });
    console.log(newList);
    res.redirect("/listings");
  })
);

//edit get route
app.get("/listings/:id/edit", async (req, res) => {
  const id = req.params.id;
  const list = await Listing.findById(id);
  res.render("listings/edit.ejs", { list });
});
//handling put route
app.patch("/listings/:id/edit", async (req, res) => {
  const id = req.params.id;
  const { title, description, image, price, country, location } = req.body;
  const editedUser = await Listing.findByIdAndUpdate(
    { _id: id },
    { title, description, image, price, country, location }
  );
  res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id/delete", async (req, res) => {
  const id = req.params.id;
  const deletedList = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.get("/listings/:id", async (req, res) => {
  const id = req.params.id;
  const list = await Listing.findById(id);
  res.render("listings/show.ejs", { list });
});

app.use((err, req, res, next) => {
  res.send("Something broke");
});
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

app.get("/", (req, res) => {
  res.send("Hey");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server is running on port 3000 ");
});
