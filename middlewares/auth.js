const Listing = require("../models/listing");
const expressError = require("../utils/expressError");
const { listingSchema } = require("../schema");
const { reviewSchema } = require("../schema");
const Review = require("../models/review");
//schema validation for listing
const validateListing = (req, res, next) => {
    const result = listingSchema.validate(req.body);
    if (result.error) {
      throw new expressError(400, result.error);
    } else {
      next();
    }
  };

  //schema validation for review
const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
      throw new expressError(400, result.error);
    } else {
      next();
    }
  };

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash('error','You Must Login First')
        return res.redirect('/user/login')
    }
    next();
}

const redirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
} 

const isOwner = async (req,res,next)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
      req.flash('error','You are not Authorized to Perform this activity!')
      return res.redirect(`/listings/${id}`)
    }
    next();
}

const isReviewOwner = async (req,res,next)=>{
  const {id,reviewId} = req.params;
  const review = await Review.findById(reviewId);
  let currUser = res.locals.currentUser._id || null
  if(!review.author.equals(currUser)){
    req.flash('error','You are not the Author of this Review')
    return res.redirect(`/listings/${id}`)
  }
  next();
}

const checkListDeleted = (req, res, next) => {
  if (req.session.listDeleted) {
    req.session.listDeleted = false; // Reset the flag
    return res.redirect('/'); // Redirect to the home page
  }
  next();
};

const checkListEdited = (req, res, next) => {
  if (req.session.listEdited) {
    req.session.listEdited = false; // Reset the flag
    return res.redirect('/'); // Redirect to the home page
  }
  next();
};

module.exports =  {isLoggedIn,redirectUrl,isReviewOwner,validateListing,isOwner,validateReview,checkListDeleted,checkListEdited}