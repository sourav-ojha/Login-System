require('dotenv').config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
require("./db/conn")

const Register = require("./models/userRegister");
// const { response } = require("express");


const app = express();
const port = process.env.PORT;

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path)


app.get('/', (req, res) => {
    res.render("index");
});

app.get('/register', (req, res) => {
    res.render("register");
});
app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/secret', auth, (req,res) => {
    console.log(`this is my cookie :${req.cookies.jwt}`);
    res.render("secret");
})

app.post('/register', async (req, res) => {
    try {
        
        const pass = req.body.password;
        const cpass = req.body.confirmpassword;
        if (pass === cpass){
            const newUser = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                phno: req.body.phno,
                gender: req.body.gender,
                email: req.body.email,
                password: pass,
                confirmpassword: cpass,
            })
            const token =await newUser.generateAuthToken();
            console.log(token);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });
            console.log("cookie :" + cookie);
            const registered = await newUser.save();
            console.log(registered);
            res.status(201).render("index");
        }else{
            res.send("password is not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Register.findOne({email:email});
        const ismatch = await bcrypt.compare(password, user.password);
        
        console.log(`email ${email} pass: ${password}`);
        const token = await user.generateAuthToken();
        console.log("login token " + token);
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        })
        console.log(`this is my cookie :${req.cookies.jwt}`);


if(ismatch){
    res.status(201).render("index");
}else{
    res.send("password mismatch");
}

    } catch (error) {
        res.send(error);
    }
})

app.listen(port, () => {

    console.log(`server is running ${port}`);
});