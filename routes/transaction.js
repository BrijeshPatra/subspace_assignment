const express = require('express');
const User = require('../models/user.js');
const Transaction = require('../models/transaction.js');

const router = express.Router();

router.post('/deposit', async (req, res) => {
    const { amount } = req.body;
    try {
        const user = await User.findById(req.userId);
        user.balance += amount;
        await user.save();

        const transaction = new Transaction({ userId: req.userId, type: 'deposit', amount });
        await transaction.save();

        res.json({ balance: user.balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/withdraw', async (req, res) => {
    const { amount } = req.body;
    try {
        const user = await User.findById(req.userId);
        if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

        user.balance -= amount;
        await user.save();

        const transaction = new Transaction({ userId: req.userId, type: 'withdrawal', amount });
        await transaction.save();

        res.json({ balance: user.balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
