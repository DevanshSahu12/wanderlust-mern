const express = require("express")
const mongoose = require("mongoose")
const ejsMate = require('ejs-mate')
const path = require("path")
const methodOverride = require("method-override")
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const ExpressError = require("./utils/ExpressError.js")
const User = require('./models/user.js')

const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

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

// Sessions
app.use(session(sessionOptions))

// Passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash
app.use(flash())

// Local Variables
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})

// Routes
app.use('/listings', listingRouter)
app.use('/listings/:id/reviews', reviewRouter)
app.use('/user', userRouter)

// app.get("/demoUser", async (req, res) => {
//     let fakeUser = new User({
//         email: 'student@gmail.com',
//         username: 'student',
//     })

//     let registeredUser = await User.register(fakeUser, 'helloWorld')
//     res.send(registeredUser)
// })

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