const express = require("express")
const User = require('../models/user')
const {Server}  = require("socket.io")
const http = require('http')
const { getUserDetailsFromToken } = require("../helper/getUserDetailsFromToken")
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const {getConversation} = require('../helper/getConversation')

const app = express()

// socket connection 

const server = http.createServer(app)
const io = new Server(server,{
    cors : {
        origin : process.env.FRONTEND_URL ,
        credentials : true
    }
})

// online user ]
// define a set for unquie id of client
const onlineUser = new Set()

io.on('connection', async (socket) => {  // When a new client connects with a socket
    console.log("connect User ",socket.id)  // Log the unique socket connection ID

    // Access the authentication token sent by the client during handshake
    const token = socket.handshake?.auth?.token  
    // console.log("token : ", token)  // Log the token for debugging

    // Decode and get user details from the token (validate user identity)
   let user = null;

    try {
        // This line is the crash-risk
        user = await getUserDetailsFromToken(token) 
    } catch (error) {
        console.error(`Socket Auth Failed:`, error.message)
        socket.disconnect(true); // Disconnect bad connection
        return; // Stop processing
    }  
    // console.log('user', user)  // Log the returned user object

    // Add this socket to a 'room' named by this user's unique ID (for private messaging)
    socket.join(user?._id.toString())  

    // Add the user ID to a set that tracks online users
    onlineUser.add(user?._id.toString()) 
    

    // Broadcast updated list of online users to all connected clients
    // onlineUser is not array , it is set or on scoket .io set cant send so convert into js array
    io.emit('onlineUser', Array.from(onlineUser))  

    // Listen for the 'message-page' event from this socket client
    socket.on('message-page', async (userId) => {
    
        console.log('userId', userId)  // Log the userId received (e.g., user navigated to message page)
         
        const userDetails = await User.findById(userId).select('-password')
        // console.log("userDetails",userDetails)

        const payload = {
            _id : userDetails?.id,
            name : userDetails?.name,
            email : userDetails?.email,
            profile_pic : userDetails?.profile_pic,
            // That line is using JavaScript’s Set object. for searching useriD in set
           // return true or false
            online : onlineUser.has(userId)
        }

        socket.emit('message-user',payload)
           
        // this is for when refresh all previous message should be in chat 
         const lastConversationMessage = await Conversation.findOne({
                        '$or' : [
                            { sender : user?._id , receiver : userId },
                            { sender : userId, receiver : user?._id }
                        ]
                }).populate('message').sort({updatedAt : -1})
                
         socket.emit('message',lastConversationMessage?.message || [])
               
    })
    
    //new message 
    socket.on('new message',async(data)=>{
                 
            //   now going to save our message in database and the fetch that data sent to receiver // as well as on sender side   
               // Inside your socket.on('new message', (data) => { ... } ) handler
                const { sender, receiver, text, imageUrl,videoUrl,msgByUserId } = data; // Destructure the IDs

                let conversation = await Conversation.findOneAndUpdate(
                    {
                        '$or' : [
                            { sender : sender, receiver : receiver },
                            { sender : receiver, receiver : sender }
                        ]
                    },
                    // --- THIS IS THE CRITICAL CHANGE ---
                    { 
                        // with set on insert it will not set value of sender and reciever it tell it which you feed in case of new create
                        // Use $setOnInsert to ensure sender/receiver are set ONLY when creating the doc
                        $setOnInsert: { 
                            sender: sender, 
                            receiver: receiver 
                        } 
                        // Add $set logic here for lastMessage updates if using the improved schema
                    }, 
                    // --- END CRITICAL CHANGE ---
                    {
                        upsert: true, 
                        new: true 
                    }
                );

                // Now, the returned 'conversation' object will contain sender and receiver IDs.
                
                const message = new Message({
                    text : text,
                    imageUrl : imageUrl,
                    videoUrl : videoUrl,
                    msgByUserId : msgByUserId

                })

                const saveMessage = await message.save()

                const updateConversation = await Conversation.updateOne ({_id :conversation?._id },{
                     '$push' : {message : saveMessage?._id}
                })
                 
                // we get  last message here sorted by updatedAt time /
                const lastConversationMessage = await Conversation.findOne({
                        '$or' : [
                            { sender : sender, receiver : receiver },
                            { sender : receiver, receiver : sender }
                        ]
                }).populate('message').sort({updatedAt : -1})
                

                //broadcasting message to the room of   reciever 
                io.to(sender).emit('message',lastConversationMessage?.message || [])

                // acknowlegde/echo to sender 
                io.to(receiver).emit('message',lastConversationMessage?.message || [])

                

            //    console.log('conversation',conversation)
            //    console.log('new message',data)


            //send conversation 
            
            const conversationSender = await getConversation(sender)
            const conversationReceiver = await getConversation(receiver)

            io.to(sender).emit('conversation',conversationSender)
            io.to(receiver).emit('conversation',conversationReceiver)

            
           

    })


    //sidebar 
    socket.on('sidebar',async(currentUserId)=>{
                //    console.log('currentUserId',currentUserId)
                
                 const conversation = await getConversation(currentUserId)

                 socket.emit('conversation',conversation)
                   
       })


    //seen

    socket.on('seen',async(msgByUserId)=>{
           let conversation = await Conversation.findOne({
                   '$or' : [
                              {sender : user?._id , receiver : msgByUserId},
                              {sender : msgByUserId , receiver :user?._id}
                   ]
           })

           const conversationalMessageId = conversation?.message || []
           
        //    Have an _id that is included in the array of conversationalMessageId.

        // Have a msgByUserId that does not match the current user ID (msgByUserId). (This ensures a user only marks messages they received as seen). 

           const updateMessages = await Message.updateMany(
                    {_id : {'$in':conversationalMessageId},msgByUserId : msgByUserId},
                    {'$set':{seen : true}}
           )

        const conversationSender = await getConversation(user?._id)
        const conversationReceiver = await getConversation(msgByUserId)

        io.to(user?._id).emit('conversation',conversationSender)
        io.to(msgByUserId).emit('conversation',conversationReceiver)




    })


    // When this socket disconnects (user closes app or loses connection)
    socket.on('disconnect', () => {
        // Remove user ID from online users set
        onlineUser.delete(user?._id?.toString())
        console.log("disconnect user", socket.id)  // Log disconnection
    })
})

module.exports = {
    app,
    server
}