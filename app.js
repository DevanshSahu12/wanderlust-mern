const express = require("express")
const mongoose = require("mongoose")
const ejsMate = require('ejs-mate')
const path = require("path")
const methodOverride = require("method-override")

const Listing = require("./models/listing.js")
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require('./schema.js')

// Init Express
const app = express()
const PORT = 8080

// Init DB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" 

// Init ejs-mate
app.engine('ejs', ejsMate)

// Init ejs render
app.set("view engine", 'ejs')
app.set("views", path.join(__dirname, "/views"))

// For POST and PUT
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

// For static files
app.use(express.static(path.join(__dirname, "/public")))

// Connect to DB
async function main(){
    await mongoose.connect(MONGO_URL)
}

main().then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err)
})

// Schema Validation
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(", ")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

// Root
app.get("/", (req, res)=>{
    res.send('This is root...')
})

// All Listings
app.get("/listings", validateListing, wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("./listings/index.ejs", { allListings })
}))

// Create New Listing
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs")
})

app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body)
    await newListing.save();
    res.redirect("/listings")
}))

// Show Listing
app.get("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params
    const thisListing = await Listing.findById(id)
    res.render("./listings/show.ejs", {thisListing})
}))

// Edit Listing
app.get("/listings/:id/edit", validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params
    const thisListing = await Listing.findById(id)
    res.render("./listings/edit.ejs", {thisListing})
}))

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    if(!req.body) {
        throw new ExpressError(400, "Send valid data for listing")
    }
    let {id} = req.params
    await Listing.findByIdAndUpdate(id, {...req.body})
    res.redirect("/listings")
}))

// Delete Listing
app.delete("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))

// 404 Error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

// Error Handling
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"} = err
    res.status(statusCode).render("error.ejs", {statusCode, message})
})

// Listening
app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`)
})

// Test Listing
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My house",
//         description: ".wad",
//         price: 1500,
//         location: "unknown",
//         country: "doom"
//     })
//     await sampleListing.save();
//     console.log("Saved")
//     res.send("Test successful")
// })