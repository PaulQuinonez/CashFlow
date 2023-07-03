const express = require('express');
const userController = require('../controllers/user.controller');

const api = express.Router();

api.get('/listUser/:id', userController.listUser);
api.get('/listUsers', userController.listUsers);
api.patch('/updateUser/:id', userController.updateUser)

module.exports = api;