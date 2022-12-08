const { Model } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const  { wallet } = require('../models')


const createUserWallet = async(req, res) => {

    return await wallet.create({
        wallet_id: uuidv4(),
        wallet_type: wallet_type,
        balance: 0.00,
        currency: currency,
        customer_id: customer_id
    })
}
 const startFundWallet = () => {


 }

module.exports= {createUserWallet, startFundWallet} 