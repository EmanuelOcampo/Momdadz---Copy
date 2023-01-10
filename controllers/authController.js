import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import {BadRequestError, NotFoundError, UnAuthenticatedError} from '../errors/index.js'

//get the name,email, password from the body or register page
const register = async (req, res) => {
    const {name, email, password} = req.body

    //check if the email has a value if not throw an error
    if (!name || !email || !password) {
        throw new BadRequestError("Please provide all values") 
    }

    //find the existing email and show an error where email is already taken
    const userAlreadyExists = await User.findOne({email});
    if (userAlreadyExists){
        throw new BadRequestError('Email is already in use')
    }


    //if the email, name, password are filled create that data in database with token
    const user = await User.create({name,email,password})
    const token = user.createJWT() 
    res.status(StatusCodes.OK)
    .json(
        {user:{
            email:user.email, 
            lastName:user.lastName,
            location:user.location, 
            name:user.name
        }, 
        token, 
        location: user.location})
}



const login = async (req, res) => {
    const {email, password} = req.body
    //check if the password and email is filled
    if (!email || !password){
        throw new BadRequestError('Please provide all values')
    }
    
    //find the email and if not register then Unauthenticated user and add the password in document since its hidden
    const user = await User.findOne({email}).select('+password')
    if (!user){
        throw new UnAuthenticatedError('Invalid Credentials')
    }
    
    //check tha hash password if same to inputed password
    const isPasswordCorrect  = await user.comparePassword(password)
    if (!isPasswordCorrect){
        throw new UnAuthenticatedError('Invalid Credentials')
    }
    const token = user.createJWT()

    //hide again the password
    user.password = undefined

    //logged the user
    res.status(StatusCodes.OK).json({user, token, location: user.location})


}
const updateUser = async (req, res) => {
    const {email, name, lastName, location } = req.body
    if (!email || !name || !lastName || !location){
        throw new BadRequestError('Please provide all values')
    }

    const user = await User.findOne({_id: req.user.userId})
    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location

    
    await user.save()


    const token = user.createJWT() 
    res.status(StatusCodes.OK).json({
        user, 
        token, 
        location: user.location
    })
    
    // res.send("update user") 

}

const landing = async (req,res) =>{
    //input here when booking is on setting up
}
export {register, login, updateUser, landing}