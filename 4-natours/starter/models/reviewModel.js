const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an user!'],
    },
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

reviewSchema.index(
  { tour: 1, user: 1 },
  { unique: true }
);

// METHODS

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  })
});

reviewSchema.statics.calcAvarageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAvarage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAvarage: 4.5
    });
  }
}

reviewSchema.post('save', function (next) {
  // Points to currently processed review
  this.constructor.Review.calcAvarageRatings(this.tour)
});

reviewSchema.pre(/^findone/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findone/, async function (next) {
  this.r.constructor.calcAvarageRatings(this.r.tour);
  next();
});

const Review = mongoose.model('Review,', reviewSchema);

module.exports = Review;
