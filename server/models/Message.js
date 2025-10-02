
const mongoose = require("mongoose")

// every save here with specific id 
const messageSchema  = new mongoose.Schema({
    text : {
        type : String ,
        default : ""
    },
    imageUrl : {
        type : String ,
        default : ""
    },
    videoUrl : {
        type : String,
        default : ""
    },
    seen : {
        type : Boolean,
        default :false
    },
    msgByUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true, 
    }
},{
    timestamps : true
})


  module.exports = mongoose.model("Message",messageSchema);
