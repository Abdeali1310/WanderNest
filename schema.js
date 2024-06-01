const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().min(15).required(),
    image: Joi.string().allow("",null).default("https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
});

module.exports.reviewSchema = Joi.object({
    rating:Joi.number().min(1).max(5).required(),
    review: Joi.string().required(),
})
