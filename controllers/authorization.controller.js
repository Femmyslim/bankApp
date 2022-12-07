const express = require('express')
const bcrypt = require('bcrypt');
const { user } = require('../models')


const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const customer= await user.findAll({where: {email: email}})

        if(customer.length===0) throw new Error('Email or password is incorrect')

        const passwordHashFromSchema = customer[0].dataValues.password_hash
        const comparePassword = await bcrypt.compare(password, passwordHashFromSchema)

        if(comparePassword===false) throw new Error('Email or password is incorrect')

        const token =jwt.sign(
            {
                email: email,
                customer_id: customer[0].dataValues.customer_id,
                phone: customer[0].dataValues.phone_number,
                lastname: customer[0].dataValues.lastname,
                othernames: customer[0].dataValues.othernames
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: "1hr"}
        )
        res.setHeader('token', token)
        res.status(201).json({
            status: true,
            token: token,
            message: "Successfully Login"
        })
    } catch (error) {
        res.status(401).json({
            status: false,
            message: error.message
        })
    }
}



module.export= { login }
