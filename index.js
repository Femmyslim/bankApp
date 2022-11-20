require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.APP_PORT   
const bodyParser = require('body-parser')
const sequelize = require('./config/sequelize')
// const routeMap = require('express-routemap')
const { v4: uuidv4 } = require('uuid');
const userRouter = require('./routes/user.routes');


app.use(bodyParser.json())
app.use(userRouter)


app.listen(port, () =>{ 
//     sequelize.authenticate()
//     .then(successResponse =>{
//         console.log('Connection has been established successfully.');
//     })
// .catch (error => {
//         console.error('Unable to connect to the database:', error);
//       })
})


