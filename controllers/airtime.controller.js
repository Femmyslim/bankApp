const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const { wallet , transaction } = require('../models')
const {getOperatorList, topUp } =require('../services/reloadly')
const {airtimeValidation} = require('../validations/airtime.validation')


const buyAirtime = async (req, res)=>{

    const {error, value} = airtimeValidation(req.body)

    if( error != undefined) {
        res.status(400).json({
            status: false,
            message: error.details[0].message
        })
    }
    else{

        try {
        const {customer_id} = req.body.userData
        const {amount, phone, operatorId} =req.body
        // operatorId = getOperatorList()
        
        const userWalletDetails= await wallet.findOne({
            where: {
                customer_id: customer_id, 
                balance: balance  
            }
        })
        if(userWalletDetails.balance <= amount) {
            throw new Error('insufficient fund')
        }else{
            const userOldBalance =  userWalletDetails.balance
            const userNewBalance = parseFloat(userOldBalance) - (parseFloat(amount))
      
         await transaction.create({
            transaction_id: uuidv4(), //use the paystack transaction reference as the transaction id
            customer_id: customer_id,
            transaction_type: 2, //1 = credit, 2 = debit
            // operatorId: operatorId,
            transaction_amount: amount,
            transaction_description: `Airtime topup for ${phone}`,
            balance_before: userOldBalance,
            balance_after: userNewBalance,
            
        })

        await wallet.update({
            balance: parseFloat(userNewBalance)
        }, {
            where: { wallet_id: userWalletDetails.dataValues.wallet_id }
        }) //update the wallet balance with the amount funded
        } 
        await topUp(amount, phone, operatorId)
        res.status(200).json({
            status: true,
            message: 'Airtime topup successful'
        })
        
  } catch (error) {
    res.status(400).json({
        status: false,
        message: error.message
    })
}
};
}

// const refundAirtime= async (req, res) =>{
//     const buyAirtimeResponse = await buyAirtime()
//     try {
//         if(buyAirtimeResponse.data.status != successful){
            
//             const userWalletDetails= await wallet.findOne({
//                 where: {
//                     customer_id: customer_id, 
//                     balance: balance  
//                 }
//             })
//             const userOldBalance =  userWalletDetails.balance
//             const userNewBalance = parseFloat(userOldBalance) + (parseFloat(amount))
      
//          await transaction.create({
//             transaction_id: uuidv4(), //use the paystack transaction reference as the transaction id
//             customer_id: customer_id,
//             transaction_type: 1, //1 = credit, 2 = debit
//             // operatorId: operatorId,
//             transaction_amount: amount,
//             transaction_description: `Refund airtime topup amount for ${phone}`,
//             balance_before: userOldBalance,
//             balance_after: userNewBalance,
            
//         })

//         await wallet.update({
//             balance: parseFloat(userNewBalance)
//         }, {
//             where: { wallet_id: userWalletDetails.dataValues.wallet_id }
//         }) 
//         res.status(200).json({
//             status: true,
//             message: 'Airtime topup successful refunded'
//         })//update the wallet balance with the amount refunded
//         } 
//         }
//     } catch (error) {
            // res.status(400).json({
            //     status: false,
            //     message: error.message
            // })
//     }

// }







module.exports= {buyAirtime}