const express = require("express");
const router = express.Router({ mergeParams: true });
const { wrapAsync } = require("../utils/wrapAsync");
const { isLoggedIn, validateReview, isReviewOwner } = require("../middlewares/auth");
const { createReview, destroyReview } = require("../controllers/reviewController");



//handling post request for reviews and maintaining relationship between listings and review
router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(createReview)
);

//handling reviews delete request
router.delete(
  "/:reviewId",isLoggedIn,isReviewOwner,
  wrapAsync(destroyReview)
);

module.exports = router;
