const mongoose = require('mongoose');
const moment = require('moment');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true,
    default: moment().format('YYYY-MM-DD'),
    set: function (value) {
      return moment(value).format('YYYY-MM-DD');
    },
    validate: {
      validator: function (value) {
        return moment(value, 'YYYY-MM-DD', true).isValid();
      },
      message: 'Formato de fecha inválido. Utilice el formato YYYY-MM-DD.'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
    required: true
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
