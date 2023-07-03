const express = require('express');
const typeController = require('../controllers/type.controller');

const api = express.Router();

api.post('/create', typeController.createtType);
api.get('/listType', typeController.getTypes);

module.exports = api;