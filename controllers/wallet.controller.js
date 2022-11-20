const { Model } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const  { wallet } = require('../models')


const createUserWallet = (req, res) => {

    return wallet.create({
        wallet_id: uuid4(),
        wallet_type: wallet_type,
        balance: 0.00,
        currency: currency,
        customer_id: customer_id
    })
}

module.exports= { createUserWallet }