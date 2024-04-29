const jwt = require('jsonwebtoken');

const secret = 'dyy'; //加密的秘钥

const JWT = {
    generate(value,exprires){
        return jwt.sign(value,secret,{expiresIn:exprires})
    },
    verify(token){
        try{
            return jwt.verify(token,secret)
        }catch(e){
            return false
        }
    }
}

module.exports = JWT

