const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { getAllClients, addClient } = require('../controllers/ClientController');

// Get all clients
router.get('/getClients', getAllClients);

// Create client
router.post('/addClient', addClient);

module.exports = router;
