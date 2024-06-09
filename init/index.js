const mongoose = require('mongoose')
const data = require('./data.js')
const Listing = require('../models/listing.js')

const mongo_url= 'mongodb://127.0.0.1:27017/wanderlust'
async function main(){
    await mongoose.connect(mongo_url)
}
main()
    .then(()=>{
        console.log(`Connected to database`)
    }).catch((err)=>{
        console.log(err)
    })

const initDB = async () =>{
    await Listing.deleteMany({})
    await Listing.insertMany(data.data)
    console.log(`initialization complete`)
}

initDB();