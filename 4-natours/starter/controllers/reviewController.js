const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {}
  if(req.params.tourId) filter = {tour: req.params.tourId}
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  })
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) eq.body.user = req.params.id;
  const newReview = await Review.create();

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {

});

exports.updateReview = catchAsync(async (req, res, next) => {

});

exports.deleteReview = catchAsync(async (req, res, next) => {

});

