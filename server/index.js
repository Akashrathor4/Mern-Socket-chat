const express = require('express')
const cors = require('cors')
require('dotenv').config()
const cookiesParser = require('cookie-parser')
const {app,server} = require('./socket/index')



const database = require("./config/database");

const router = require("./routes/index");

// const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json());
app.use(cookiesParser());

const PORT = process.env.PORT || 4000;

//connect db
database.connect();

app.get('/',(req,res)=>{
    res.json({
        message : `App is Up and running ${PORT}`
    })
})
//api endpoint
app.use("/api",router);

server.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
})
