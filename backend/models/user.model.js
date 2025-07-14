import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
    },
    cartData:{
        type:Object,
        default: {},
    },
    isEmailVerified:{
        type: Boolean,
        default: false,
    },
    emailVerificationOTP: {
        type: String,
    },
    emailVerificationExpires: {
        type: Date,
    },
    resetOTP: {
        type: String,
    },
    resetOTPExpires: {
        type: Date,
    },

}, {minimize:false}); // to allow empty objects

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;