const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');

const home = async ( req, res)=>{
    try {
        res.status(200).send("Welcome to world route")
    } catch (error) {
        console.log(error);
    }
}

const register = async (req, res)=>{
    try {
        const {username, email, phone, password} = req.body;
        console.log(req.body);
        const userExists =await User.findOne({email:email});
        if(userExists){
            return res.status(400).json({message:"Email already exists"});
        }
        const userCreated = await User.create({username, email, phone, password});
        res.status(201).json({msg : userCreated,
             token: await userCreated.generateToken(), 
             userId:userCreated._id.toString(),  
        });
    } catch (error) {
        res.status(400).send({message:"page not found"});
    }
};

// User Login Logic

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (!userExists) {
            return res.status(400).send({ message: "Invalid Email or password!" });
        }
        const user = await userExists.comparePassword(password);
        if (user) {
            return res.status(200).json({
                message: "Login Successful",
                token: await userExists.generateToken(),
                userId: userExists._id.toString(),
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        return res.status(500).send({ message: "page not found" });
    }
}



const user = async( req, res)=>{
    try {
        const userData = req.user;
        console.log(userData);
        return res.status(200).json({userData});
    } catch (error) {
        console.log(`Error from the user route ${error}`);
    }
}


const forgotPassword = async (req, res)=>{
    let testAccount = await nodemailer.createTestAccount();

    const { email } = req.body;
    try {
        const oldUser = await User.findOne({email});
        if(!oldUser){
            return res.status(400).send({message: "User Not Exist"});
        }
        const secret = process.env.JWT_SECRET_KEY ;
        const token = jwt.sign({email : oldUser.email, id: oldUser._id},secret, {
            expiresIn:"5m",
        });
        const link = `http://localhost:5000/api/auth/reset-password/${oldUser._id}/${token}`;

        const transporter = nodemailer.createTransport({
            service: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true, // use SSL
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
            }
          });          
          const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: `Password Reset ${oldUser.username}`,
            text: `Click here and Reset your password ${link}`,
            html:`<b>You can reset your password Using this link!!!</b><br/>
                     <button style="border-radius: 20px; padding: 10px; border:2px solid red ; color: white; margin-top: 50px;">
                     <a href=${link} >Reset Password Click here</a></button> `
          };

            await transporter.sendMail(mailOptions, (error, info)=> {
            if (error) {
              console.log('Error:', error);
            } else {
              console.log('Email sent:', info.response);
              res.send(info);
            }
          });
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
}


const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    try {
        const oldUser = await User.findOne({ _id: id });
        if (!oldUser) {
            return res.status(400).send({ message: "User Not Exist" });
        }
        const secret = process.env.JWT_SECRET_KEY;
        try {
            const verify = jwt.verify(token, secret);
            return res.render("setNewPassword.ejs", { email: verify.email, status: "Link is Expired Not Verified" });
        } catch (error) {
            return res.status(401).send("Not Verified");
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
}




const saveNewPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const oldUser = await User.findOne({ _id: id });
        if (!oldUser) {
            return res.status(400).send({ message: "User Not Exist" });
        }

        const secret = process.env.JWT_SECRET_KEY;
        try {
            const verify = jwt.verify(token, secret);
            const encryptedPassword = await bcrypt.hash(password, 10);
            const updatePass = await User.updateOne(
                { _id: id },
                { $set: { password: encryptedPassword } }
            );
            // if(updatePass){
            //     return res.redirect("http://localhost:5173/login")
            // }
            // return res.status(200).send({ message: "Password Updated Successfully" });
            return res.render("setNewPassword.ejs", { email: verify.email, status: "Verified" });
        } catch (error) {
            return res.status(401).send({ message: "Token Not Verified" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
}



module.exports = {home, register, login, user, forgotPassword, resetPassword, saveNewPassword };