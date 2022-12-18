require('dotenv').config()
const { user, otp, account } =require('../models')
const { signUpValidation} =require('../validations/signup.validation')
const { profileupdateValidation } = require('../validations/profileupdate.validation')
const { createAccountNumberOfUser } =require('../controllers/account.controller')
const { createUserWallet } = require('../controllers/wallet.controller')
const { dissolveMyPassword, produceOtp }=require('../utils')
const { v4: uuidv4 } = require('uuid')
const { Op } = require("sequelize");
const { sendEmail } =require('../services/email')
const { sendSms } =require('../services/sms')




const signUp = (req, res) => { 
    // joi validation
    const { error, value } = signUpValidation(req.body)

    if (error != undefined) {
      
        res.status(400).json({
            status: false,
            message: error.details[0].message
        })
    }else{
    
    const { lastname, othernames, email, phone, password, repeat_password } = req.body;
        const customer_id = uuidv4()
        const _otp = produceOtp()
    try {

    user.findAll({
        where: {
            [Op.or]: [
                { email: email },
                { phone_number: phone }
            ]
        }
    })
    .then((data) => {
        if (data.length > 0) throw new Error('Email or phone number already exist')

        return dissolveMyPassword(password) //[hash, salt]

    })
    .then(([hash, salt]) => {

        return user.create({
            customer_id: customer_id,
            lastname: lastname,
            othernames: othernames,
            email: email,
            phone_number: phone,
            password_hash: hash,
            password_salt: salt,
        })

    })
    .then((createUserData) => {
   
        const customer_fullname = `${lastname} ${othernames}`
        const sn = createUserData.sn
        return createAccountNumberOfUser(customer_id, customer_fullname, sn)

    })
     .then(createUserWalletData => {
         return createUserWallet(1, 'NGN', customer_id)  //create wallet for the cutomwer
     })   
    .then((insertIntoOtpTable) => {
     
        return otp.create({
           
            otp: _otp,
            email: email,
            phone: phone,
        })

    })
    .then((data3) => {
        
        sendEmail(email, 'OTP', ` Hello  ${lastname} ${othernames} ,\n Your OTP is ${_otp}`)

        res.status(200).send({
            status: true,
            message: 'Registration successful, An otp has been sent to your email'
        })

    })
    .catch((err) => {
           console.log("errrr1: ", err)
        res.status(400).json({
            status: false,
            message: err.message || "Some error occurred while creating the Customer."
        })

    })

    } catch (error) {
        console.log("error: ", error)
        res.status(400).json({
            status: false,
            message: error.message || "Some error occurred while creating the Customer."
        })
    }
}
}


const phoneAndEmailVerification= (req, res) => {

    const phone_otp = produceOtp()

    const { email, phone, _otp } = req.params
    try {
        otp.findAll({
            where:{
                email: email,
                otp: _otp
            },
            attributes: ['otp', 'email', 'phone', 'createdAt'],
        })
        .then((otpDataFetched) => {
            if (otpDataFetched.length == 0) throw new Error('Invalid OTP')
    
            console.log("otpdataFetched: ", otpDataFetched[0])

            const timeOtpWasSent = Date.now() - new Date(otpDataFetched[0].dataValues.createdAt)
        
            const convertMilliToMin = Math.floor(timeOtpWasSent / 60000) // 60000 is the number of milliseconds in a minute

            if (convertMilliToMin > process.env.EXPIRATION_TIME) throw new Error('OTP has expired')

            return user.update({ is_email_verified: true }, {
                where: {
                  email: email
                }
              })
            

        
        })
        .then((emailverifiedData) => { 
            return otp.destroy({
                where: {
                    otp: _otp,
                    email: email
                }
            })
        })
        .then((data3) => { 

            return otp.create({
                otp: phone_otp,
                phone: phone,
                email: email
            })
           
        })
        .then((data4) => {
            
            sendEmail(email, 'Email Verification Successful', ` Hello  ${email},\n Thank you for verifying your email. An otp has been sent to your phone number, kindly use this otp to also verify your phone number`)
         
        })
        .then((data5) => {
                res.status(200).send({
                    status: true,
                    message: 'Email verification successful, An otp has been sent to your phone number'
                })
        })
        .catch((err) => {
            res.status(400).json({
                status: false,
                message: err.message || "Some error occurred while verifying OTP."
            })
        })
        
    } catch (err) {
        res.status(400).json({
            status: false,
            message: err.message || "Some error occurred while verifying OTP."
        })

    }

}

const verifyPhoneOtp= (req, res)=> {
    const { phone_otp, phone} = req.params

    try {
        otp.findAll({
            where: {
                phone: phone,
                otp: phone_otp
            },
            attributes: ['otp', 'phone', 'createdAt']
        })
        .then((phoneotpfetched) => {

            if(phoneotpfetched === 0) throw new error('Invalid OTP')

            const timePhoneOtpReceive = Date.now() - new Date(phoneotpfetched[0].dataValues.createdAt)
            const convertMillisecondsToMin =Math.floor(timePhoneOtpReceive/60000)
            if(convertMillisecondsToMin > process.env.EXPIRATION_TIME) throw new error(`OTP expired`)

            return user.update({is_phone_number_verified: true}, {
                where: {
                    phone_number: phone
                },
            })
        })
        .then((phoneIsVerified) =>{
            return otp.destroy({
                where: {
                    phone: phone,
                    otp: phone_otp

                },

            })
        })
        .then((data6) =>{

            res.status(200).json({
                status: true,
                message: `Phone Otp successfully verified`,
            })
        })
        .catch((error) => {
            res.status(400).json({
                status: false,
                message: error.message  || `Some error occurred`
            })
        })
        
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message  || `Some error occurred`
        })
    }

}

const resendPhoneOtp= (req, res) => {

    const {phone} = req.params
    const newOtp = produceOtp()
    try {
        
        otp.findAll({
            where: {
                phone: phone
            },
        })
        .then((data) => {

            if(data.length === 0) throw new error(`Phone number does not exist`)

            return otp.destroy({
                where: {
                    phone: phone
                },
            })
        })
        .then((data2) => {

            return otp.create({
                where: {
                    otp: newOtp,
                    phone: phone
                },
            })

        })
        .then((data3) =>{
            sendSms(phone, `Hello, your new otp is ${newOtp}`)
            res.status(200).json({
                status: true,
                message: `OTP resent to your Phone number`
            })
        })
        .catch((error) =>{
            res.status(400).json({
                status: false,
                message: error.message
            })
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

const resendEmailOtp=(req, res) => {
    const {email} = req.params
    const newOtp= produceOtp()

    try {
        otp.findAll({
            where: {
                email:email
            },
        })
        .then((data) => {
            if(data.length ===0) throw new error(`Email does not exist`)

            return otp.destroy({
                where: {
                    email: email
                },
            })
        })
        .then((data2) =>{

            return otp.create({
                otp: newOtp,
                email: email
            })
        })
        .then(() => {
            sendEmail(email, `Hello your new otp is ${newOtp}`)
            res.status(200).json({
                status: true,
                message: `Otp resent to email`
            })
        })
        .catch((error) => {
            res.status(400).json({
                status: false,
                message: error.message
            })
        })

    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

const profileUpdate= async (req, res)=> {

    const { error, value} = profileupdateValidation(req.body)

    if(error != undefined) {

        res.status(400).json({
            status: false,
            message: error.details[0].message
        })
    }else{
        const { customer_id }= req.params
        const { title, lastname, othernames, gender, house_number, street, landmark, local_govt,
            dob, country, state_origin, local_govt_origin, means_of_id, means_of_id_number, marital_status} =req.body
    }
    try {

        await user.update({

            title: title,
            lastname: lastname,
            othernames: othernames,
            gender: gender,
            house_number: house_number,
            street: street,
            landmark: landmark,
            local_govt: local_govt,
            dob: dob,
            country: country,
            state_origin : state_origin,
            local_govt_origin:local_govt_origin,
            means_of_id: means_of_id,
            means_of_id_number: means_of_id_number,
            marital_status : marital_status
        }, { where: { customer_id: customer_id} } )

        res.status(200).send({
            status: true,
            message: 'Customer updated successfully'
        });
        
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.details[0].message
        })   
    }    

}




module.exports= { signUp, phoneAndEmailVerification, verifyPhoneOtp, resendPhoneOtp, resendEmailOtp, profileUpdate }