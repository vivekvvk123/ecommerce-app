import express from 'express'; // Added: type: "module" for import syntax
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/user.route.js';

dotenv.config();

//App config
const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
connectCloudinary()

//Middlewares
app.use(express.json());
app.use(cors());

//API endpoints
app.use('/api/user', userRouter)

app.get('/', (req, res)=>{
    res.send('API is running');
})

app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT)
})