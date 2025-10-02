
const Conversation = require("../models/Conversation")

// logic is designed to retrieve a list of conversations for a specific user and format the data to show an overview for a chat/inbox display.

exports.getConversation = async(currentUserId) => {
 
    if(currentUserId){
                            const currentUserConversation = await Conversation.find({
                                '$or' : [
                                    {sender : currentUserId},
                                    {receiver : currentUserId}
                                ]
                        }).sort({updatedAt : -1}).populate('message').populate('sender').populate('receiver')

                        //    console.log('currentUserConversation',currentUserConversation)

                        // i didnt want to send message for side so make send custom data 
                        // i want to sen donly unseen message 
                        const conversation = currentUserConversation.map((conv)=>{
                                
                            const countUnseenMsg = conv.message.reduce((prev,curr)=> {
                                        if(curr?.msgByUserId?.toString() !== currentUserId){
                                            return prev + (curr.seen ? 0 : 1)
                                        }else{
                                            return prev
                                        }
                            },0)
                            
                            return {
                                    _id : conv?._id,
                                    sender : conv?.sender,
                                    receiver : conv?.receiver,
                                    unseenMsg : countUnseenMsg,
                                    lastMsg : conv.message[conv?.message?.length -1 ]
                                }
                        })

                        

                        return conversation;

                   }
                   
    else{
               return [];
                  
            }
 
}

