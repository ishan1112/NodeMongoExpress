const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const empSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    confirmPassword:{
        type: String,
        required: true,
    },
    tokens:[
        {
            token:{
            type: String,
            required: true,
            }
        }
    ]
});
empSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({ _id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save()
        console.log(token);
        return token;
    } catch (error) {
        return res.send(error + "Error Come");
        console.log(error + "Error Here");
    }
};

empSchema.pre("save",async function(next){
    if(this.isModified("password")){
        // const passHas = await bcrypt.hash(this.password,10);
        // console.log(`The Current Pass is ${this.password}`);
        this.password = await bcrypt.hash(this.password,10);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword,10);
        // this.confirmPassword = undefined;
    }
    next();
});


const Register = new mongoose.model("Register",empSchema);

module.exports = Register;