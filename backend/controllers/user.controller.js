import userModel from '../models/user.model.js';
import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const createToken = (id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn: '3d'})
}


// Route for user login
const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        // Check if user exists
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found"});
        }
        
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = createToken(user._id);
            return res.json({success: true, token});
        }
        else{
            return res.json({success:false, message: "Invalid password"});
        }

    }
    catch(error){
        console.error(error);
        res.json({success: false, message: error.message});

    }
}

// Route for user registration
const registerUser = async (req,res)=>{
    try{
        const {name, email, password} = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({success: false, message: "User already exists"})
        }

        // Validate email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"});
        }
        if(password.length < 8){
            return res.json({success: false, message: "Password must be at least 8 characters long"});
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        })

        // Generate JWT token
        const token = createToken(newUser._id);
        res.json({success:true, token});

    }
    catch(error){
        console.error("Error in user registration:", error);
        res.json({success: false, message: error.message});
    }
}

// Route for admin login
const adminLogin = async (req,res) =>{

}

export { loginUser, registerUser, adminLogin };