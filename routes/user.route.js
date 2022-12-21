const express = require('express')
const router = express.Router()
const { signUp, phoneAndEmailVerification, verifyPhoneOtp, updateBeneficiary, resendPhoneOtp, resendEmailOtp, profileUpdate, addBeneficiaries, getAllBeneficiaries, getUserDetails }=require('../controllers/customer.controller')



router.post('/signup', signUp)

router.get('/verify-email-otp/:_otp/:email/:phone', phoneAndEmailVerification)

router.get('/verify-phone-otp/:phone_otp/:phone', verifyPhoneOtp)

router.post('/verify-phone-otp/:phone', resendPhoneOtp)

router.post('/verify-email-otp/:email', resendEmailOtp)

router.put('/update', profileUpdate)

router.get('/profile', getUserDetails)

router.post('/beneficiary/add', addBeneficiaries)

router.put('/beneficiary/:beneficiary_id', updateBeneficiary)

router.get('/beneficiaries', getAllBeneficiaries)


module.exports= router