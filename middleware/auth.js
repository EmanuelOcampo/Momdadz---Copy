import {UnAuthenticatedError} from '../errors/index.js'
import jwt from 'jsonwebtoken'

const auth = async (req,res,next)=>{
    //check the header
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnAuthenticatedError('Authentication Error')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { 
            userId: payload.userId,
        }
        next()
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Error')        
    }
}

const isAdmin = (req, res, next) =>{
    auth(req, res, () => {
        console.log(req.user);
        if (!req.user.isAdmin) {
            next()
        }else {
            throw new UnAuthenticatedError('Authentication Error')
        }
    })
}

export {auth, isAdmin}