const User = require("../models/user")

const bcryptjs = require('bcryptjs');


exports.registeredUser = async(req,res) => {
    try{
              //fetch data from request body
             console.log('register ke aandar')
             const {name , email , password,profile_pic} = req.body;
             
             // check user is present or not  
             
             const checkUserPresent = await User.findOne({email});

             if(checkUserPresent){
                   return res.status(400).json({
                      success:false,
                      message:"User Already Exist"
                   })
             }

             // password hash
             const salt = await bcryptjs.genSalt(10);
             const hashPassword = await bcryptjs.hash(password,salt);

             //save in db
             const user = await User.create({
                name,
                email,
                password:hashPassword,
                profile_pic
             })

             //for client side response 
             return res.status(200).json({
                success:true,
                message:"Registered Successfully",
                data:user,
             })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Registration Failed",
        })
    }
}