require('dotenv').config()
const axios = require('axios')
const baseUrl = process.env.PAYSTACK_BASE_URL


const initializePayment =(amount, email)=>{

    return axios({
        method: 'post',
        url: `${baseUrl}/transaction/initialize`,
        headers: {
            Authorization: `Bearer, ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "Application/json"
        },
        data: {
            amount: amount * 100,
            email: email
        }
    }
    )
}

const verifyPayment=(ref)=>{
    return axios({
        method: 'get',
        url: `${baseUrl}/transaction/verify/${ref}`,
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    })
}

const getBank =()=>{
    return axios({
        method: 'get',
        url: `${baseUrl}/bank`,
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    })
}
  

module.exports = {getBank, verifyPayment, initializePayment}