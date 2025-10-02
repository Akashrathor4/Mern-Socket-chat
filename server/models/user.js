const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
      name : {
          type : String,
          required:[true,"Provide name"],
          trim : true,
      } ,
      email : {
        type : String,
        required : [true,"Provide name"],
        trim : true
      },
      password : {
        type : String,
        required : [true,"Provide password"],
      },
      profile_pic : {
        type : String,
        default : ""
      }
},
{timestamps : true}
);

  module.exports = mongoose.model("User",userSchema);