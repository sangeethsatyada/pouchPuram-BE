const mongoose = require('mongoose');

const connectDb = async()=>{

   await  mongoose.connect(process.env.ADMIN_DB_URL).then(()=>{
      console.log("Connected to DB")
    }).catch((err)=>{
      console.log(err)
    })

}
module.exports = connectDb;
