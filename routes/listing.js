const express=require("express");
const router=express.Router();
const ExpressError=require("../utils/ExpressError.js")

const wrapAsync=require("../utils/wrapAsync");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}




// index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    // console.log(allListing);
    res.render("listings/index.ejs",{allListing});
}))



// to avoid we can use routes like this
// we can use first static route and then dynamic route
// there is no need of sequence if we use route validation

// /listing/new
// /listing/edit/:id
// /listing/view/:id




// new route
router.get("/new",(req,res)=>{
    res.render("listings/newlist.ejs");
})

 
// show route
router.get("/:id",wrapAsync(async (req,res)=>{           //id is dynamic parameter , sequence is important
    let {id}=req.params;
    const list=await Listing.findById(id).populate("review");
    if(!list)
    {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs",{list});
}))


// post route
router.post("/",validateListing, wrapAsync(async (req,res,next)=>{
    // let {image,title,description,price,location,country}=req.body;
    // const listing=req.body.listing;

    // try{

        const newlisting=await new Listing(req.body.listing);
        await newlisting.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listing");
    // }catch(err){
    //     next(err);
    // }

}))


// edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    if(!list)
        {
            req.flash("error","Listing you requested for does not exist!");
            res.redirect("/listing");
        }
    res.render("listings/edit.ejs",{list});
}))


// update route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
}))


// delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const deletelist=await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
}))

module.exports=router;