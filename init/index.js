let sampleData = require('./data')
const mongoose = require('mongoose');
const Listing = require('../models/listing');

//connection
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust").then(()=>console.log("DB Connected")).catch((err)=>console.log(err))

async function init(){
    await Listing.deleteMany({})
    sampleData = sampleData.map((obj)=>({
        ...obj,
        owner:'666038e480187e89072f75e5',
    }));
    await Listing.insertMany(sampleData);
    console.log("DB Initialized");
}

async function imgURL() {
    try {
        const listings = await Listing.find({});
        let count = 1;
        for (const listing of listings) {
            await Listing.findByIdAndUpdate(listing._id, { image: { url: `/images/image${count}.avif` } });
            count++;
        }
        console.log('Image URLs updated successfully');
    } catch (error) {
        console.error('Error updating image URLs:', error);
    }
}


init();
imgURL();