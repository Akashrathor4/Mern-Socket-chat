const User = require("../models/user")

const bcryptjs = require("bcryptjs")

const jwt = require("jsonwebtoken")

exports.checkPassword = async(req,res) => {
    try{
         const {password , userId} = req.body

         console.log("in the password controller")
         
         const user = await User.findById(userId)



         if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

         console.log("user tak pahuch gye")
         console.log("password",password)
         const verifyPassword = await bcryptjs.compare(password,user.password)
         console.log("verify password",verifyPassword )
         if(!verifyPassword){
            return res.status(400).json({
                message:"Wrong password",
                success:false
            })
         }

         console.log("Password is correct")
         
         const payLoad = {
            id : user._id,
            email : user.email
         }

         const token = await jwt.sign(payLoad,process.env.JWT_SECRET_KEY,{expiresIn : '10d'})

            user.token = token;
            user.password = undefined;

         const cookieOptions = {
            expires:new Date(Date.now()+10*24*60*60*1000),
            httpOnly :true,
            secure : true
         } 

         return res.cookie("token",token,cookieOptions).status(200).json({
            message:"Login Successfully",
            token : token,
            data : user,
            success:true
         })


    }catch(error){
        console.error("Password compare error", error)
         return res.status(500).json({
            success:false,
            message:"Password verififcation failed",
            
         })
    }
}
