const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const generateToken=(id)=>{
    var token = jwt.sign({id},process.env.SECRET,{
        expiresIn:'30d'
    });
    return token;
}

module.exports=generateToken;