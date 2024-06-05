const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { wrapAsync } = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares/auth");



//listing route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

//create new list
router.get(
  "/new",isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);

//handling post request for create
router.post(
  "/new",isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { title, description, image, price, country, location } = req.body;
    //checking for custom error
    const newList = new Listing({
      title,
      description,
      image,
      price,
      country,
      location,
    });
    newList.owner =  req.user._id;
    await newList.save();
    //flash message for listing created
    req.flash('success','New Listing Created!')
    res.redirect("/listings");
  })
);

//edit get route
router.get(
  "/:id/edit",isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    const list = await Listing.findById(id);
    if(!list){
      req.flash('error','List not found!')
      res.redirect('/listings')
    }
    res.render("listings/edit.ejs", { list });
  })
);

//handling put route
router.patch(
  "/:id/edit",isLoggedIn,isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    const { title, description, image, price, country, location } = req.body;
    const editedUser = await Listing.findByIdAndUpdate(
      { _id: id },
      { title, description, image, price, country, location }
    );
    req.flash('success','Listing Edited!')
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id/delete",isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    const deletedList = await Listing.findByIdAndDelete(id);
    req.flash('success','Listing Deleted!')
    res.redirect("/listings");
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    const list = await Listing.findById(id).populate("reviews").populate('owner').exec();
    if(!list){
      req.flash('error','List not found!')
      res.redirect('/listings')
    }
    res.render("listings/show.ejs", { list });
  })
);

module.exports = router