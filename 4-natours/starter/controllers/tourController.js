const fs = require('fs')
const Tour = require('./../models/tourModel')

exports.checkID = (req, res, next) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }
  next();
}

exports.checkBody = (req, res, next) => {
  if (
    !req.body.name ||
    !req.body.duration ||
    !req.body.maxGroupSize ||
    !req.body.difficulty ||
    !req.body.price
  ) {
    return res.status(400).json({
      status: 'fail',
      message: 'Bad Request!',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id;

  // const tour = tours.find((el) => el.id == id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'Success!',
    // data: {
    //   newTour,
    // },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
