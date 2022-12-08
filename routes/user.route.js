const express = require('express')
const router = express.Router()
const { signUpCreation, phoneAndEmailVerification, verifyPhoneOtp, 
        resendPhoneOtp, resendEmailOtp, profileUpdate }=require('../controllers/customer.controller')



router.post('/signUp', signUpCreation)

router.get('/verify-email-otp/:_otp/:email/:phone', phoneAndEmailVerification)

router.get('/verify-phone-otp/:phone_otp/:phone', verifyPhoneOtp)

router.post('/verify-phone-otp/:phone', resendPhoneOtp)

router.post('/verify-email-otp/:email', resendEmailOtp)

router.put('/profile/:customer_id', profileUpdate)


module.exports= router