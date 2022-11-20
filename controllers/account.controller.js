const { account } = require('../models')


const produceAccountNumber =(sn) => {

    let day = new Date().getDate()
    let year =((new Date().getFullYear()).toString()).slice(2)
    let combination = sn.toString().padStart(6,"0")


    return `${combination}${day}${year}`

}


const createAccountNumberOfUser = (customer_id, customer_fullname, sn) => {

    return account.create({

        account_number: produceAccountNumber(sn),
        account_name: customer_fullname,
        customer_id: customer_id,
        balance: 0.00,
        lien: "none"

    })
}




module.exports= {produceAccountNumber, createAccountNumberOfUser}