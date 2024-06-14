const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review.js")

const listingSchema = new Schema({
        title: {
            type: String,
            default: true
        },
        description: String,
        image: {
            type: String,
            default: "https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => (v==="")?"https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            :v 
        },
        price: Number,
        location: String,
        country: String,
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ]
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing