const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')

dotenv.config({path: './.env'});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

// READ JSON FILE
const tours = fs.readFileSync('tours-simples.json', 'utf-8')

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data sucessfully loaded!');
  } catch (err) {
    console.log(err);
  }
};
// DELETE ALL DATA FROM DB

const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data sucessfully deleted!');
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

console.log(process.argv)