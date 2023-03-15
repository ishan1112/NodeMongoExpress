require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const Register = require("./models/registerSchema");
const port = process.env.PORT || 3001;
const bcrypt = require("bcryptjs");
require("./db/conn");
const jwt = require("jsonwebtoken");

// const cToken = async() => {
//     const jwtToken = await jwt.sign({_id:"641019fbd1f0b168cb505095"},"HelloAsEveryoneKnowThatIAmNothingButIfISayMyNameItWillGiveNameConnection");
//     console.log(jwtToken);
//     const jwtVar = await jwt.verify(jwtToken,"HelloAsEveryoneKnowThatIAmNothingButIfISayMyNameItWillGiveNameConnection")
//     console.log(jwtVar);
// };


// cToken();




const temp_path = path.join(__dirname,"./temp/views")
const parial_path = path.join(__dirname,"./temp/partials")
app.use(express.static(temp_path));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set("view engine","hbs");
app.set("views",temp_path)

hbs.registerPartials(parial_path);

// console.log(process.env.SECRET_KEY);


app.get("/",(req,res) => {

    return res.render("index");
});

app.get("/reg",(req,res) => {

    return res.render("register");
});

app.post("/reg",async(req,res) => {
    try {
        const pass = req.body.password;
        const cpass = req.body.confirmPassword;
        if(pass === cpass){
            const regEmp = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
            });

            console.log("App.js Register Employees" + regEmp);

            const token = await regEmp.generateAuthToken();
            console.log("App.js Token Part" + token);

            // Hash The Password 😒

            const saveEmp = await regEmp.save();
            return res.status(201).render("index");
        }else{
            return res.send("<h1>Password must be same!🐍🐉🦖🤏🏻</h1>")
        }
    } catch (error) {
        return res.status(404).send(error)
    }
});

app.get("/login",(req,res) => {

    return res.render("login");
});

app.post("/login",async(req,res) => {
try {

    const email = req.body.email;
    const pass = req.body.password;
    const findUser = await Register.findOne({email});
    const isMatch = await bcrypt.compare(pass,findUser.password);
    const token = await findUser.generateAuthToken();
    console.log("App.js Token Part" + token);
    // console.log(isMatch);
    if(isMatch){
        return res.status(201).render("index");
    }else{
        return res.send("<h1>Password is not matching</h1>");
    }
    // return res.send(findUser)
    // console.log(findUser);
    // console.log(`${email} ${pass}`);
} catch (error) {
    return res.status(404).send(error);
}
});









app.listen(port,() => {
    console.log(`You Are on Port ${port}`);
});