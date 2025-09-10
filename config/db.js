const mongoose = require('mongoose');

const connectDb = async()=>{
  try{
    mongoose.connect("mongodb+srv://dbUser:Password@pouchpro.66znkay.mongodb.net/pouchPro").then(()=>{
      console.log("Connected to DB")
    }).catch((err)=>{
      console.log(err)
    })
  }catch(err){
    console.log(err)
  }
}
module.exports = connectDb;
