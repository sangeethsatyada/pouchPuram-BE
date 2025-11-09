const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const packagingRequirements = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true},
  email: { type: String, required: true},
  phone: { type: String, required: true},
  state: { type: String, required: true},
  packagingType: { type: String, required: true},
  quantity: { type: String, required: true},
  material: { type: String, required: true},
  size: { type: String, required: true},
  requirements: { type: String, required: true}


}, { timestamps: true });
module.exports = mongoose.model('packagingRequirements', packagingRequirements);
