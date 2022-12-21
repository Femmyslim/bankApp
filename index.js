require('dotenv').config()
const express = require('express')
var cors = require('cors')
const displayRoutes = require('express-routemap')
const app = express()
const port = process.env.APP_PORT   
const bodyParser = require('body-parser')
const sequelize = require('./config/sequelize')
const authorizationRoute = require('./routes/authorization.route')
const registerRoute = require('./routes/user.route')
const walletRoute = require('./routes/wallet.route')
const airtimeRoute = require('./routes/airtime.route')






app.use(cors())
app.use(bodyParser.json())
app.use(registerRoute)
app.use(authorizationRoute)
app.use(airtimeRoute)
app.use(walletRoute)


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