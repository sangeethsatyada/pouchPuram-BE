const express = require('express');
const router = express.Router();
const { getReports, generateReport } = require("../controllers/reportController")

router.get('/daily', getReports);
router.post('/daily', generateReport);

module.exports = router;
