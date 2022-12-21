
const express = require('express')
const router = express.Router()
const {startFundWallet, getAccountStatement, getAllBank, completeFundWallet}
    = require('../controllers/wallet.controller')
const { authorization }  = require('../middlewares/authorization')




router.post('/fund-wallet/start', authorization, startFundWallet)

router.post('/fund-wallet/complete/:reference',authorization, completeFundWallet)

router.get('/account-statement', authorization, getAccountStatement)

router.get('/banks', authorization, getAllBank)

module.exports = router

