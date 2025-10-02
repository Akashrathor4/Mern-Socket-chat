
exports.logout = async(req , res) =>{
         try {
            const cookieOptions = {
                   httpOnly:true,
                   secure : true,
                   
            }

            return res.cookie("token","",cookieOptions) .status(200).json({
                success : true,
                message :"Session Out"
                
            })
         } catch (error) {
              return res.status(500).json({
                   success : false,
                   message :"logout fail"
              })
         }
}