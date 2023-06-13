const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router
  .param('id', userController.checkID);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(
    userController.checkBody,
    userController.createUser
  );

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
