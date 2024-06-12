const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsync");
const Listing = require("../models/listing");

router.get('/:name',wrapAsync(async (req,res)=>{
    const category = req.params.name;
    res.locals.category = category || '';
    const filteredList = await Listing.find({category:category})
    res.render('listings/index',{allListings:filteredList})
}))

module.exports = router