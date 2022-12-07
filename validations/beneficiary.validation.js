

const Joi = require('joi')


const beneficiaryValidation = (data) => {

    const schema = Joi.object({

        fullname: Joi.string().min(2).required(),
        phone_number: Joi.string().min(2).optional(),
        bank_account: Joi.string().min(10).max(10).optional(),
        details: Joi.string().optional(),
        userData: Joi.object().optional(),
  
    })
  
  return  schema.validate(data);


}

const updateBeneficiaryValidation = (data) => {

  const schema = Joi.object({
      
      fullname: Joi.string().min(2).optional(),
      phone_number: Joi.string().min(2).optional(),
      bank_account: Joi.string().min(10).max(10).optional(),
      details: Joi.string().optional(),
      userData: Joi.object().optional(),

  })

return  schema.validate(data);


}







module.exports = { beneficiaryValidation, updateBeneficiaryValidation }