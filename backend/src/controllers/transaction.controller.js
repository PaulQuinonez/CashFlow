const User = require('../models/User');
const Transaction = require('../models/transaction');
const moment = require('moment');
const Type = require('../models/type');

// Crear un nuevo ingreso asociado al usuario actual
const createTransaction = async (req, res) => {
  try {
    const { amount, description, date, type_id } = req.body;
    const userId = req.user.sub; // Obtener el ID del usuario autenticado

    // Validar el formato de la fecha utilizando moment.js
    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).send({ error: 'Formato de fecha inválido. Utilice el formato YYYY-MM-DD.' });
    }

    // Obtener el tipo de transacción asociado al type_id
    const transactionType = await Type.findById(type_id);

    if (!transactionType) {
      return res.status(404).send({ error: 'No se encontró el tipo de transacción asociado al type_id.' });
    }

    // Verificar si es un egreso y validar el balance del usuario
    if (transactionType.name === 'Egreso') {
      const user = await User.findById(userId);
      if (amount > user.balance) {
        return res.status(400).send({ error: 'No puedes retirar más dinero del que tienes disponible en tu balance.' });
      }
    }

    // Realizar la acción correspondiente según el tipo de transacción
    let balanceChange = 0;

    if (transactionType.name === 'Ingreso') {
      balanceChange = amount;
    } else if (transactionType.name === 'Egreso') {
      balanceChange = -amount;
    }

    // Crear la nueva transacción
    const transaction = await Transaction.create({
      amount,
      description,
      date,
      type_id,
      user: userId
    });

    // Actualizar el balance del usuario
    const user = await User.findByIdAndUpdate(userId, { $inc: { balance: balanceChange } }, { new: true });

    res.status(201).send({ success: true, data: { transaction, balance: user.balance } });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// TODO: Obtener todos los ingresos del usuario actual
const getTransactions = async (req, res) => {
  try {
    const userId = req.params['id']; // TODO: Obtener el ID del usuario autenticado

    // TODO: Obtener todos los ingresos del usuario
    const transaction = await Transaction.find({ user: userId }).populate('type_id').exec();
    res.status(200).send({ success: true, data: transaction });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// TODO: Obtener un ingreso específico por ID
const getTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.user.sub; // TODO: Obtener el ID del usuario autenticado

    //? Verificar si el ingreso pertenece al usuario actual
    const transaction = await Transaction.findOne({ _id: transactionId, user: userId }).populate('type_id').exec();;

    if (!transaction) {
      return res.status(404).send({ success: false, error: 'Ingreso no encontrado' });
    }

    res.status(200).send({ success: true, data: transaction });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// TODO: Eliminar un ingreso específico
const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.user.sub; // Obtener el ID del usuario autenticado

    // Verificar si la transacción pertenece al usuario actual y eliminarla
    const transaction = await Transaction.findOneAndDelete({ _id: transactionId, user: userId });

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transacción no encontrada' });
    }

    // Obtener el tipo de transacción asociado a la transacción eliminada
    const transactionType = await Type.findById(transaction.type_id);

    if (!transactionType) {
      return res.status(404).send({ error: 'No se encontró el tipo de transacción asociado a la transacción.' });
    }

    // Realizar la acción correspondiente según el tipo de transacción
    let balanceChange = 0;

    if (transactionType.name === 'Ingreso') {
      balanceChange = -transaction.amount;
    } else if (transactionType.name === 'Egreso') {
      balanceChange = transaction.amount;
    }

    // Actualizar el balance del usuario
    const user = await User.findByIdAndUpdate(userId, { $inc: { balance: balanceChange } }, { new: true });

    res.status(200).json({ success: true, data: { transaction, balance: user.balance } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const sumIncomes = async (req, res) => {
  try {
    const userId = req.params['id']; // Obtener el ID del usuario autenticado
    const transactions = await Transaction.find({ user: userId }).populate('type_id');
    const totalIncomes = transactions.reduce((sum, transaction) => {
      if (transaction.type_id.name === 'Ingreso') {
        return sum + Number(transaction.amount.toString());
      }
      return sum;
    }, 0);
    res.status(200).json({ success: true, totalIncomes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const sumExpenses = async (req, res) => {
  try {
    const userId = req.params['id']; // Obtener el ID del usuario autenticado
    const transactions = await Transaction.find({ user: userId }).populate('type_id');
    const totalExpenses = transactions.reduce((sum, transaction) => {
      if (transaction.type_id.name === 'Egreso') {
        return sum + Number(transaction.amount.toString());
      }
      return sum;
    }, 0);
    res.status(200).json({ success: true, totalExpenses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
  sumIncomes,
  sumExpenses
};
