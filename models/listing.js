const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/023/041/976/small_2x/glass-globe-ball-with-tree-growing-and-green-nature-blur-background-eco-earth-day-concept-generat-ai-free-photo.jpg",
        set:(v)=>
        (v === "" ? "https://static.vecteezy.com/system/resources/thumbnails/023/041/976/small_2x/glass-globe-ball-with-tree-growing-and-green-nature-blur-background-eco-earth-day-concept-generat-ai-free-photo.jpg" : v),
        
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:"review",
    }],
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        await review.deleteMany({_id : {$in : listing.review}});
    }
})


const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;