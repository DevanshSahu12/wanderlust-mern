const express = require("express")
const app = express()
const PORT = 8080

const mongoose = require("mongoose")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" 
const Listing = require("./models/listing.js")

const ejs = require("ejs")
const ejsMate = require('ejs-mate')
const path = require("path")
app.engine('ejs', ejsMate)
app.set("view engine", 'ejs')
app.set("views", path.join(__dirname, "/views"))

app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, "/public")))

const methodOverride = require("method-override")
app.use(methodOverride('_method'))


console.log(ejsMate.layout)

async function main(){
    await mongoose.connect(MONGO_URL)
}

main().then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err)
})

app.get("/", (req, res)=>{
    res.render('boilerplate.ejs')
})

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My house",
        description: ".wad",
        price: 1500,
        location: "unknown",
        country: "doom"
    })
    await sampleListing.save();
    console.log("Saved")
    res.send("Test successful")
})

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("./listings/index.ejs", { allListings })
})

app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs")
})

app.post("/listings", async (req, res) => {
    let newListing = new Listing(req.body)
    await newListing.save();
    res.redirect("/listings")
})

app.get("/listings/:id", async (req, res) => {
    let {id} = req.params
    const thisListing = await Listing.findById(id)
    res.render("./listings/show.ejs", {thisListing})
})

app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params
    const thisListing = await Listing.findById(id)
    res.render("./listings/edit.ejs", {thisListing})
})

app.put("/listings/:id", async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndUpdate(id, {...req.body})
    res.redirect("/listings")
})

app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})

app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`)
})