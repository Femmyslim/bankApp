
const Joi = require('joi')


const airtimeValidation = (data) => {

    const schema = Joi.object({

        phone_number: Joi.string().min(2).required,
        amount: Joi.string().min(3).max(13).required,
        operator_id: Joi.string().required,
  
    })
  
  return  schema.validate(airtimeValidation);


}

module.exports ={airtimeValidation}