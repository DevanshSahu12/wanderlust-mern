const Listing = require("../models/listing")

// All
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("./listings/index.ejs", { allListings })
}

// New
module.exports.newListingForm = (req, res) => {  
    res.render("./listings/new.ejs")
}
module.exports.newListing = async (req, res) => {
    let url = req.file.path
    let filename = req.file.filename
    let newListing = new Listing(req.body)
    newListing.image = {url, filename}
    newListing.owner = req.user._id
    await newListing.save()
    req.flash("success", "New Listing Created")
    res.redirect("/listings")
}

// Show
module.exports.showListing = async (req, res) => {
    let {id} = req.params
    const thisListing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner")
    if(!thisListing) {
        req.flash('error', 'Listing you requested for does not exist')
        res.redirect('/listings')
    }
    res.render("./listings/show.ejs", {thisListing})
}

// Edit
module.exports.editListingForm = async (req, res) => {
    let {id} = req.params
    const thisListing = await Listing.findById(id)
    res.render("./listings/edit.ejs", {thisListing})
}
module.exports.editListing = async (req, res) => {
    let {id} = req.params
    let updatedListing = await Listing.findByIdAndUpdate(id, {...req.body})
    
    if(typeof req.file !== "undefined") {
        let url = req.file.path
        let filename = req.file.filename
        updatedListing.image = {url, filename}
        await updatedListing.save()
    }

    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`)
}

// Delete
module.exports.deleteListing = async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted")
    res.redirect("/listings")
}