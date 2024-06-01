const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const { wrapAsync } = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const { reviewSchema } = require("../schema");
const Review = require("../models/review");

//schema validation for review
const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new expressError(400, result.error);
  } else {
    next();
  }
};

//handling post request for reviews and maintaining relationship between listings and review
router.post(
  "/",
  validateReview,
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
    res.redirect(`/listings/${id}`);
  })
);

//handling reviews delete request
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
