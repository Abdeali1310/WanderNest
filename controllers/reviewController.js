const Listing = require("../models/listing");
const Review = require("../models/review");

const createReview = async (req, res) => {
  const { rating, review } = req.body;
  const id = req.params.id;
  const rev = await new Review({
    rating,
    comment: review,
  });

  rev.author = req.user._id;
  rev.save();
  //updating the listing by providing its particular review's id and maintaining relationship
  const listing = await Listing.findById(id);
  listing.reviews.push(rev);
  await listing.save();

  // const updatedListing = await Listing.findById(id).populate('reviews').exec();
  // console.log((updatedListing));
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${id}`);
};

const destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
module.exports = { createReview, destroyReview };
