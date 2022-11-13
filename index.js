require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.APP_PORT   


app.use(bodyParser.json())






app.listen(port, () =>{
    console.log(`This is listening on port ${port}`)
})
