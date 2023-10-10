const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures');
const factory = require('../controllers/handlerFactory');
//const catchAsync = require('./../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) eq.body.user = req.user.id;
  next();
}

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);