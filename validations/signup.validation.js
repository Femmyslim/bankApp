const Joi = require('joi');


const signUpValidation =(data) =>{

    const schema = Joi.object({
        
        lastname: Joi.string().min(2).required(),
        othernames: Joi.string().min(2).required(),
        phone: Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password')
       
    })
       
    return schema.validate(data);
}



module.exports = { signUpValidation }


