const userModel = require("../models/usersModel");
const {generateToken} = require("../services/handleToken");

const userLogin =async (req,res)=>{
    const {email,password} = req.body;
    console.log(email,password);
    try{
        const user = await userModel.findOne({email:email,password:password});
        if(!user) return res.status(400).json({message:"Invalid email or password",success:false});
        const token = generateToken(user.toObject());
        if(token==null) return res.status(500).json({message:"Error generating token",success:false});
        return res.status(200).json({message:"Login successful",success:true,token:token,data:user});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports={userLogin};