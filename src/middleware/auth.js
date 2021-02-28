const jwt = require("jsonwebtoken");
const Register = require("../models/userRegister");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SecretKey);
        console.log(verifyUser);
        const User = await Register.findOne({_id: verifyUser._id});
        console.log(User);
        next(); 
    } catch (error) {
        res.status(401).send(error);
    }
      
}
module.exports = auth;
