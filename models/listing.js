const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema
const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
})

listingSchema.post('findOneAndDelete',async (listData)=>{
    if(listData.reviews.length){
        // console.log(listData);
        const res = await Review.deleteMany({_id:{$in:listData.reviews}})
        // console.log(res);
    }
})

const Listing = mongoose.model('listing',listingSchema)
module.exports = Listing