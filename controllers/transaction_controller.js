const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Public
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();

    return res.status(200).json({
      count: transactions.length,
      data: transactions,
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Server Error',
      success: false
    });
  }
}

// @desc    Add all transactions
// @route   POST /api/v1/transactions
// @access  Public
exports.addTransaction = async (req, res, next) => {
  try {
    const { text, amount } = req.body;

    const transaction = await Transaction.create(req.body);

    return res.status(201).json({
      data: transaction,
      success: true
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);

      return res.status(400).json({
        error: messages,
        success: false
      })
    } else {
      return res.status(500).json({
        error: 'Server Error',
        success: false
      });
    }
  }
}

// @desc    Delete all transactions
// @route   DELETE /api/v1/transactions/:id
// @access  Public
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        error: 'No transaction found.',
        success: false
      })
    }

    await transaction.remove();

    return res.status(200).json({
      data: {},
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Server Error',
      success: false
    });
  }
}
