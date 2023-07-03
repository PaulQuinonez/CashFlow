const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const protect = require('../middleware/authenticate');

const api = express.Router();

api.post('/register', protect, transactionController.createTransaction);
api.get('/listtransactions/:id', protect, transactionController.getTransactions);
api.get('/listtransaction/:id', protect, transactionController.getTransactionById);
api.delete('/deletetransaction/:id', protect, transactionController.deleteTransaction);
api.get('/getSumIncomes/:id', protect, transactionController.sumIncomes);
api.get('/getSumExpenses/:id', protect, transactionController.sumExpenses);

module.exports = api;