const express= require('express')
const { addPackagingRequirements, getPackingRequirements } = require('../controllers/packagingController')
const router = express.Router()
router.post("/submitQuote",addPackagingRequirements);
router.get("/getData",getPackingRequirements)

module.exports = router
