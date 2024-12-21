const express=require("express");
const router=express.Router();
const user=require("../models/user.js");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new user({email,username});
        const registeredUser=await user.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to WanderLust!");
        res.redirect("/listing");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
})



router.get("/login",(req,res)=>{
    console.log("right")
    res.render("users/login.ejs");
});

router.post("/login",
    passport.authenticate("local",
        {failureRedirect: "/login", failureFlash: true,}),
        async(req,res)=>{
            console.log("here");
    req.flash("success","Welcome back to WanderLust!");
    res.redirect("/listing");
    // res.send("logged in");
});


module.exports=router;