const mongoose = require("mongoose")
require("dotenv").config();

console.log(process.env.MONGODB_URL)

exports.connect = () =>{
         mongoose.connect(process.env.MONGODB_URL)
         // mongoose.connect() return promise because of async fun so that we use then() and catch()...
         .then(()=> console.log("DB Connected Successfully"))
         .catch((error)=> {
                console.log("Db connection issue");
                console.log(error);
                process.exit(1);
         })
    
};