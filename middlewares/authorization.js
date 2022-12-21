require('dotenv').config()
const jwt = require('jsonwebtoken')


const authorization = async (req, res) => {

    const token = req.header.authorization //this is because we are sending the token to the header and it we want to pass it to the boddy we do req.body.authorization

    if(!token){
        res.status(401).json({
            status: false,
            message: "Unauthorized"
        })
    }else{

        try {
            const tokenSplit = token.split('')

            const decrypt = jwt.verify(tokenSplit[1], process.env.JWT_SECRET_KEY, (err, decoded) => {
                if(err) throw new Error (err.message)

                req.body.userData= decoded //this is because the req.userData.customer_id is required as the payload
                next()
                
              });
        } catch (err) {
            res.status(401).json({
                status: false,
                message: "Unauthorized"
            })
        }
    }
}




module.exports= {authorization }