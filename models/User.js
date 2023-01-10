import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, 'Please provide name'], 
        minlength:3,
        maxlength:20,
        trim: true 
    },
    email: {
        type: String,
        required:[true, 'Please provide email'], 
        validate:{
            validator:validator.isEmail,
            message:'Please provide valid email'
        },
        unique: true, 
    },
    password: {
        type: String,
        required:[true, 'Please provide password'], 
        minlength:6,
        select:false
    },
    lastName: {
        type: String,
        // required:[true, 'Please provide name'], 
        maxlength:20,
        trim: true,
        default: 'lastName'
    },
    location: {
        type: String,
        // required:[true, 'Please provide name'], 
        maxlength:20,
        trim: true,
        default: 'my city'
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

///////////////////////////////////////////////////function and methods in BD ////////////////////////////////////
/////////////////////////////////// "save" "createJWT" "comparePassword"/////////////////////////

//hash the password and save it
UserSchema.pre('save', async function (){
    // console.log(this.modifiedPaths());

    if (!this.isModified('password'))
    return
    const salt =  await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)

    // console.log(this.password);
})

//create an token and register that process
UserSchema.methods.createJWT = function(){
    return jwt.sign({ 
        userId: this._id
    }, 
    process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

//compare password is created function that use in the authController.js
UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch
}

export default mongoose.model('User', UserSchema)