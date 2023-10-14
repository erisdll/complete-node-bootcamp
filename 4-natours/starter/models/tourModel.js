const mongoose = require('mongoose');
const slugify = require('slugify')
//const User = require('./userModel')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The tour must have a name!'],
      unique: true,
      trim: true,
      minlength: [10, 'The tour name must at least 10 characters!'],
      maxlength: [40, 'The tour name must not have more than 40 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters!']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'The tour must have a duration!'],
    },
    maxGroupSize: {
      type: Number,
      require: [true, 'The tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'The tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy or medium or difficult!',
      },
    },
    ratingsAvarage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0!'],
      max: [5, 'Rating must be below 5.0!'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'The tour must have a price!'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price!',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'The tour must have a summary!'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'The tour must have a cover image!'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guide: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

// METHODS

tourSchema.index({ price: 1, ratingsAvarage: -1 });
tourSchema.index({slug: 1});
tourSchema.index({startLocation: '2dSphere'});

// VIRTUAL POPULATE
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before the .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {lower: true});
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({secretTour: {$ne: true}});
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.polulate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
})

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pileline().unshift({
//     $match: {secretTour: {$ne: true}},
//   });
//   console.log(this.pileline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
