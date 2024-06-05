const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const { wrapAsync } = require("../utils/wrapAsync");
const Review = require("../models/review");
const { isLoggedIn, validateReview } = require("../middlewares/auth");



//handling post request for reviews and maintaining relationship between listings and review
router.post(
  "/",
  validateReview,isLoggedIn,
  wrapAsync(async (req, res) => {
    const { rating, review } = req.body;
    const id = req.params.id;
    const rev = await Review.create({
      rating,
      comment: review,
    });
    //updating the listing by providing its particular review's id and maintaining relationship
    const listing = await Listing.findById(id);
    listing.reviews.push(rev);
    await listing.save();

    // const updatedListing = await Listing.findById(id).populate('reviews').exec();
    // console.log((updatedListing));
    req.flash('success','New Review Created!')
    res.redirect(`/listings/${id}`);
  })
);

//handling reviews delete request
router.delete(
  "/:reviewId",isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted!')
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
