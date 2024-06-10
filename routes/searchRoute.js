const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsync");
const Listing = require("../models/listing");

router.get('/',wrapAsync(async (req,res)=>{
    const {listName} = req.query;
    const filteredList = await Listing.find({title: new RegExp(listName, 'i')})
    res.render('listings/index',{allListings:filteredList,query: listName})
}))

module.exports = router