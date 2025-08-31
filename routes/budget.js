const express = require('express');
const router = express.Router();
const { getBudget, setBudgetLimit } = require('../controllers/budgetController');

router.get('/', getBudget);
router.post('/', setBudgetLimit);

module.exports = router;
