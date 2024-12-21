const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ExpressError=require("./utils/ExpressError.js")
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");

const session=require("express-session");
const flash=require("connect-flash");

// const {listingSchema,reviewSchema}=require("./schema.js");
// const wrapAsync=require("./utils/wrapAsync.js")

// const Listing=require("./models/listing");
// const review=require("./models/review");

const passport=require("passport");
const LocalStrategy=require("passport-local");


const listing=require("./routes/listing.js");
const review=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const user=require("./models/user.js");


const mongoose_url='mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(mongoose_url);
}

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


const sessionOption={
    secret:"mysupersecretstring",
    resave:false,
    unInitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    next();
})

// demouser
// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new user({
//         email:"shradha@gmail.com",
//         username:"shradha",
//     });

//     let registeredUser=await user.register(fakeUser,"password123");
//     res.send(registeredUser);
// })

// root route
app.get("/",(req,res)=>{
    res.send("This is root page...");
})

app.use("/listing",listing);
app.use("/listing/:id/review",review);
app.use("/",userRouter);


app.use("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})


app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong!"}=err;
    res.render("error.ejs",{message});
    // res.status(status).send(message);
    // res.send("something went wrong!");
})



// app.get("/testListing",async (req,res)=>{            //if we go route /testListing this sample add
//     let samplelisting=new Listing({                  //to database each time whenever we use /testListing
//         title:"villa",
//         description:"inner peace of mind",
//         price:5000,
//         location:"Osho Ashram",
//         country:"India"
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("data saved");
// });


app.listen(3000,()=>{                                       //app.listen callback is not a http request handler
    console.log("app is listening..");                      //can't use res.send
})