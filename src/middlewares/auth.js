import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";
import responses from "../constants/responses.js";

export const isAuthentication = async(req,res,next)=>{
    try{
        console.log("req",req.cookies)
        const {token}= req.cookies
        if(!token)
        {
            return res.status(401).json(responses.UNAUTHORIZED());
        }
    
        const decodedata = jwt.verify(token,process.env.JWT_SECERT)
        req.user= await User.findById(decodedata.id)
        next()
    }catch (error) {
    console.log("Error", error);
    return res.status(500).json(responses.SERVER_ERROR());
  }  
}
