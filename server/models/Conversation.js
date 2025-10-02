const mongoose = require("mongoose");

// by this schema you find a conserversation between a pair of user 

const conversationSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    message : [
                {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Message"
                }
    ],

},{
    timestamps : true,
});

module.exports = mongoose.model('Conversation',conversationSchema);