// Add this route to your Express router
const express = require("express")
const router = express.Router()
const {
  addInvoice,
  getInvoice,
  getAllInvoices,
  updateInvoice,
  deleteInvoice,
  sendReceipt,
  sendInvitation,
} = require("../controllers/InvoiceController")

// Existing routes
router.get("/getInvoices", getAllInvoices)
router.get("/getInvoice/:id", getInvoice)
router.post("/addInvoice", addInvoice)
router.put("/updateInvoice/:id", updateInvoice)
router.delete("/deleteInvoice/:id", deleteInvoice)

router.post("/sendReceipt", sendReceipt)
router.post("/sendInvitation", sendInvitation)

module.exports = router
