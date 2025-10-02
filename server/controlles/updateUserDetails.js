const { getUserDetailsFromToken } = require("../helper/getUserDetailsFromToken");
const User  = require("../models/user");

exports.updateUserDetails = async (req, res) => {
    try {
        
        const token = req.cookies.token || "";
        
        
        const user = await getUserDetailsFromToken(token);
        
        const { name, profile_pic } = req.body;
        
        // only find by id and update
        const userInformation = await User.findByIdAndUpdate(
            user._id,
            { name, profile_pic },
            { new: true }
        );
         
        // updateOne + findById
        //    const userInformation = await User.updateOne({ _id: user._id }, { name, profile_pic },{new:true});
        
        // const userInformation = await User.findById(user._id);

        // console.log("userInformation",userInformation)
        
        return res.status(200).json({
            message: "user update successfully",
            data: userInformation,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "updateUserDetails Fail",
            success: false
        });
    }
}
