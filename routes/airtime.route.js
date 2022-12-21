const express = require("express")
const router = express.Router()
const {buyAirtime }= require('../controllers/airtime.controller')



router.post('/pay/airtime', buyAirtime)


module.exports = router