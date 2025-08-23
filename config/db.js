const mongoose = require('mongoose');

const connectDb = async()=>{
  try{
    mongoose.connect("mongodb://localhost:27017/pouchPro").then(()=>{
      console.log("Connected to DB")
    }).catch((err)=>{
      console.log(err)
    })
  }catch(err){
    console.log(err)
  }
}
module.exports = connectDb;
