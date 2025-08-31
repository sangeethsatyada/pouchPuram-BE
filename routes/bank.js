const express = require('express');
const router = express.Router();
const { getBank, handleBankRequest } = require('../controllers/bankController');

router.get('/', getBank);
router.post('/', handleBankRequest);
router.patch('/', handleBankRequest);

module.exports = router;
