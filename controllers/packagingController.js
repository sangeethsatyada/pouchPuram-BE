const { default: mongoose } = require("mongoose");
const packagingRequirements = require("../models/packagingRequirements")

const addPackagingRequirements = async (req, res) => {
  const { name, email, phone, packagingType, quantity, material, size, requirements,state} = req.body;

  try{
    if(!name || !email || !phone || !packagingType || !quantity || !material || !size || !requirements || !state){
      return res.status(400).json({message: "All fields are required"})
    }
    const packagingRequirement = new packagingRequirements({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      phone,

      packagingType,
      quantity,
      material,
      size,
      requirements,
      state
    })
    await packagingRequirement.save()
    return res.status(200).json(packagingRequirement)
  }catch(err){
    console.log(err)
    return res.status(500).json(err)
  }

}


const getPackingRequirements = async (req, res) => {
  try{
    const packagingRequirementsData = await packagingRequirements.find()
    console.log({packagingRequirements:packagingRequirementsData})
    return res.status(200).json({data:packagingRequirementsData})
  }catch(err){
    console.log(err)
    return res.status(500).json(err)
  }
}

module.exports = {
    addPackagingRequirements,
    getPackingRequirements
}
