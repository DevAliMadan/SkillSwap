const mongoose = require('mongoose');

const reviewSchema  = new mongoose.Schema({

})

reviewSchema.index({})

module.exports = mongoose.model('Review', reviewSchema)