require('dotenv').config()
const express = require('express')
const displayRoutes = require('express-routemap')
const app = express()
const port = process.env.APP_PORT   
const bodyParser = require('body-parser')
const sequelize = require('./config/sequelize')
const { v4: uuidv4 } = require('uuid');
const authorizationRouter = require('./routes/authorization.route')
const userRouter = require('./routes/user.routes');


app.use(bodyParser.json())
app.use(userRouter)
app.use(authorizationRouter)


app.listen(port, () =>{ 
//     sequelize.authenticate()
//     .then(successResponse =>{
//         console.log('Connection has been established successfully.');
//     })
// .catch (error => {
//         console.error('Unable to connect to the database:', error);
//       })
})






displayRoutes(app)