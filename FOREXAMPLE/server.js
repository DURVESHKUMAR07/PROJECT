const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const user=require("./routes/user");
const post=require("./routes/post");
const exp = require("constants");

app.use("/user",user);
app.use("/post",post);

const sessionOption={
    secret : "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
   }

app.use(session(sessionOption));
app.use(flash());


app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    console.log(req.session);
    
    req.flash("success","user register successfully!");
    req.flash("error","some error occured!");
    res.redirect("/hello");
    // res.render("page.ejs",{name:req.session.name});
});

app.get("/hello",(req,res)=>{
    // console.log(req.flash("success"));
    // res.send(`hello, ${req.session.name}`);
    res.locals.message=req.flash("success");
    res.locals.errMsg=req.flash("error");
    res.render("page.ejs",{name:req.session.name});

})

app.get("/reqcount",(req,res)=>{
    if(req.session.count)
    {
        req.session.count++;
    }
    else
    {
        req.session.count=1;
    }
    res.send(`you have sent a request ${req.session.count} times`);
});
    

app.get("/test",(req,res)=>{
    res.send("request successful");
})


app.get("*",(req,res)=>{
    res.send("request accepted");
})

app.listen(3000,()=>{
    console.log("server is listening on port 3000");
})