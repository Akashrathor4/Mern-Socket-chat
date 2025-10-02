const User = require("../models/user")

exports.checkEmail = async(req,res) => {
     try{
          const {email}  = req.body;

          const checkEmail = await User.findOne({email}).select("-password");

          if(!checkEmail){
            return res.status(400).json({
                success : "false",
                message : "User not Exit"
            })
          }

          return res.status(200).json({
            message : "email verify",
            success : true,
            data : checkEmail
          })
     }catch(error){
             return res.status(500).json({
                success :false,
                message : "Email Verification Failure"
             })
     }
}