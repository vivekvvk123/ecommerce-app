// const mongoose = require('mongoose'); 
import mongoose from 'mongoose';

const connectDB = async () =>{
    await mongoose.connect(process.env.MONGODB_URI)
    .then(() =>{
        console.log('MongoDB connected successfully');
    })
    .catch((error) =>{
        console.error('MongoDB connection failed:', error);
    })
}

export default connectDB;

