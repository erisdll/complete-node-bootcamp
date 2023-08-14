const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAvarage,price';
  req.query.fields = 'name,price,ratingsAvarage,summary,difficulty';
  next();
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'Success!',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'Success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = Tour.aggregate([
      {
        $match: {ratingsAvarage: {$gte: 4.5}},
      },
      {
        $group: {
          _id: {$toUpper: '$difficulty'},
          num: {$sum: 1},
          numRatings: {$sum: '$ratingsQuantity'},
          avgRating: {$avg: '$ratingsAvarage'},
          avgPrice: {$avg: '$price'},
          minPrice: {$min: '$price'},
          maxPrice: {$max: '$price'},
        },
      },
      {
        sort: { avgPrice: 1}
      }
    ]);
    
    res.status(200).json({
      status: 'Success',
      data: {
        stats
      }
    });    
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: {$push: {$name}}
        }
      },
      {
        $addFields: { month: '$_id'}
      },
      {
        $project: {
          id: 0
        }
      },
      {
        $sort: { numTourStarts: -1}
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        plan,
      },
    });      
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });    
  }
}