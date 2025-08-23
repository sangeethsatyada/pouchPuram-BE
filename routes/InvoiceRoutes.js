const express = require('express')
const { addInvoice, getInvoice,getAllInvoices,updateInvoice } = require('../controllers/InvoiceController')
const router = express.Router()
router.post("/addInvoice",addInvoice);
router.get("/getInvoices",getAllInvoices);
router.get("/getInvoice/:id",getInvoice);
router.put("/updateInvoice/:id",updateInvoice);


module.exports = router
