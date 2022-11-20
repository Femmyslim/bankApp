require('dotenv').config()
const axios = require('axios')
const fetch = require('node-fetch');
const formData = require('form-data')


const sendSms =(phone, message) =>{

    let type = 0
    let routing = 3
    let bodyFormData = new formData();
    bodyFormData.append('token', process.env.SEND_TOKEN);
    bodyFormData.append('sender', process.env.SMS_SENDER);
    bodyFormData.append('to', phone);
    bodyFormData.append('message', message);
    bodyFormData.append('type', type);
    bodyFormData.append('routing', routing);

    return fetch(`${process.env.SEND_API_BASE_URL}/sms/`, {
        body: bodyFormData,
        method: 'POST'
    });

}

module.exports= { sendSms }

