const nodemon = require('nodemon')
const { Model } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const  { wallet } = require('../models')
const {getBank, verifyPayment, initializePayment} = require('../services/paystack')


const createUserWallet = (wallet_type, currency='NGN', customer_id) => {

    return wallet.create({
        wallet_id: uuidv4(),
        wallet_type: wallet_type,
        balance: 0.00,
        currency: currency,
        customer_id: customer_id
    })
}
 const startFundWallet = async (req, res) => {
    const {email, amount} =req.body

    try {
        const startPayment =await initializePayment(email, amount)
        res.status(200).json({
            status: true,
            message: 'Payment initialize',
            data: startPayment.data.data
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
        
    }


}

const getAccountStatement =async (req, res) => {
    const customer_id =req.body.userData
    const todaysDate = new Date()
    const month =todaysDate.getMonths() +1
    const year =todaysDate.getFullYear()
    const startDate = `${year}-${month}-${todaysDate}-01`
    const endDate =`${year}-${month}-${todaysDate}-31`

    const statementStartDate = req.query.startDate || startDate
    const statementEndDate = req.query.endDate  || endDate

    try {
        const transactionData = await transaction.findAll({
            where:{
                customer_id: customer_id,
                createdAt: {
                    [op.gte]: statementStartDate,
                    [op.lte]: statementEndDate
                }
            },
            order: [['createdAt','desc']]
        })
        res.status(200).send({
            satus: true,
            message: 'Account statement retreved successfully',
            data: transactionData
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
} 
const getAllBank =async (req, res) =>{
    try {
        const allBank = await getBank()
        res.status(200).json({
            status: true,
            message: 'All bank retrieved',
            data: allBank.data.data
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            message: 'Sorry an error occurred, please try again later'
        })
    }
}
const completeFundWallet = async(req, res) =>{
    const customer_id = req.body.userData
    const {reference} = req.params
    try {
        const verifyPaymentRefrence = await verifyPayment(reference)
        const paystackResponse = verifyPaymentRefrence.data

        if(paystackResponse.status===false){
            throw new Error('Sorry, this transaction reference is invalid')
        }
        if(paystackResponse.status != success){
            throw new Error('Sorry, this transaction was not completed')
        }
        const customerWalletDetails = await wallet.findAll({ where: {customer_id: customer_id, wallet_type: 1}})
        const customerOldBalance = customerWalletDetails.balance
        const customerNewBalance =parseFloat(customerOldBalance) + (parseFloat(paystackResponse.data.balance))

        await transaction.create({
            transaction_id: reference, //use the paystack transaction reference as the transaction id
            customer_id: customer_id,
            transaction_type: 1, //1 = credit, 2 = debit
            transaction_description: `Deposit of #${paystackResponse.data.amount / 100} to wallet`,
            balance_before: parseFloat(customerWalletDetails),
            balance_after: parseFloat(customerNewBalance),
            transaction_amount: parseFloat(paystackResponse.data.amount / 100)

        })

        await wallet.update({
            balance: parseFloat(customerNewBalance)
        }, 
        {
            where: { wallet_id: customerWalletDetails.dataValues.wallet_id }
        }) 
        res.status(200).json({
            status: true,
            message: "Your wallet has been funded successfully"
        })


    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Sorry an error has occurred, please try again later"
        })
    }
}


module.exports= {createUserWallet, startFundWallet, getAccountStatement, getAllBank, completeFundWallet} 