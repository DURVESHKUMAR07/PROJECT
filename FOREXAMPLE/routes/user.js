const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("this route is for user");
})

module.exports=router;