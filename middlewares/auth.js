const Listing = require("../models/listing");
const expressError = require("../utils/expressError");
const { listingSchema } = require("../schema");
const { reviewSchema } = require("../schema");
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
module.exports =  {isLoggedIn,redirectUrl,validateListing,isOwner,validateReview}