const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    confirmpassword:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    phno:{
        type: Number,
        required: true,
        unique:true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]

})

userSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, process.env.SecretKey );
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        console.log("generateuth");
        return token;
        
    } catch (error) {
        res.send("the error is " + error);
        console.log("the error is " + error);
    }
}

userSchema.pre("save", async function (next){
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        // this.confirmpassword = undefined;
    }
    next();
})

const Register = new mongoose.model("Register",userSchema);
module.exports = Register;
