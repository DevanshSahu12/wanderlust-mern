if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const mongoose = require('mongoose')
const initData = require('./data.js')
const Listing = require('../models/listing.js')

const MONGO_URL= 'mongodb://127.0.0.1:27017/wanderlust'
const DB_URL = process.env.ATLASDB_URL
async function main(){
    await mongoose.connect(DB_URL)
}
main()
    .then(()=>{
        console.log(`Connected to database`)
    }).catch((err)=>{
        console.log(err)
    })

const initDB = async () =>{
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({...obj, owner: "66713951a36cfe467e94d3f3"}))
    await Listing.insertMany(initData.data)
    console.log(`initialization complete`)
}

initDB();