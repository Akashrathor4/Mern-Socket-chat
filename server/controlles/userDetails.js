
const { getUserDetailsFromToken } = require("../helper/getUserDetailsFromToken");


exports.userDetails = async(req,res) => {
    try{
         const token = req.cookies.token || ""

         console.log("token chek:",token)

         const user = await getUserDetailsFromToken(token)
         
         console.log("get user")
         return res.status(200).json({
            message:"send user details successfully",
            data : user
         })

    }catch(error){
          return res.status(500).json({
             message : error.message || message,
             success : false,
             
          })
    }
}