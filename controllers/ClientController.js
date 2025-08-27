const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Get all clients
const getAllClients=async (req, res) => {
  try {
    const clients = await Client.find();
    res.json({ data: clients });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
}

// Create client
const addClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json({ id: client._id, message: 'Client created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating client', error: error.message });
  }
}

module.exports = { getAllClients, addClient };
