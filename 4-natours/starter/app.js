const fs = require('fs');

const express = require('express');
const app = express();

app.use(express.json);

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });
//
// app.post('/', (req, res) => {
//   res.send('Yuo can post to this endpoint');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('api/v1/tours/:id/', (req, res) => {
  console.log(req.params)
  const id = +req.params.id;
  
  const tour = tours.find((el) => el.id === id);

  // if (id > tour.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }


  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success!',
        data: {
          newTour,
        },
      });
    }
  );
});

app.patch('api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "Fail",
      message: "Invalid ID"
    })  
  }

  res.status(200).json({
    status: "Success",
    data: {
      tour: '<Updated tour here>'
    }
  })
});

app.delete('api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'Success',
    data: null
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
