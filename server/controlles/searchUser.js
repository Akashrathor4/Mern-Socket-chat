const user = require("../models/user")


exports.searchUser = async(req,res) =>{
      try {
        
           const {search} = req.body

           const query = new RegExp(search,'i','g')
        //    i = case insensitive , g = globally 
           const User = await user.find({
                 "$or" : [
                    {name : query},
                    {email: query}
                 ]
           }).select("-password") 

           return res.status(200).json({
                message : 'All User',
                data : User,
           })


      } catch (error) {
          return res.status(500).json({
            message : error.message || error,
            error :true 
          })
      }
}
