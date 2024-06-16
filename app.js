const express = require("express")
const mongoose = require("mongoose")
const ejsMate = require('ejs-mate')
const path = require("path")
const methodOverride = require("method-override")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const flash = require('connect-flash')

const ExpressError = require("./utils/ExpressError.js")

const listings = require('./routes/listing.js')
const reviews = require('./routes/review.js')

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

// Init Session
const sessionOptions = {
    secret: "secretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

// Root
app.get("/", (req, res)=>{
    res.send('This is root...')
})

// Sessions and Flash
app.use(session(sessionOptions))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

// Routes
app.use('/listings', listings)
app.use('/listings/:id/reviews', reviews)

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