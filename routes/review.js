const express=require("express");
const router=express.Router({mergeParams : true});
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js");
const review=require("../models/review");
const Listing=require("../models/listing");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


// review post route
router.post("/",validateReview,wrapAsync(async(req,res)=>{

    console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview=new review(req.body.review);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    let {id}=req.params;
    console.log("new review saved");
    // res.send("new review saved");
    req.flash("success","New Review Created!");
    res.redirect(`/listing/${id}`);
    

}));



// review delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {review:reviewId} });
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`);
}))



module.exports=router;