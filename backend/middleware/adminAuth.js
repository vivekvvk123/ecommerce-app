import jwt from 'jsonwebtoken';

const adminAuth = async(req, res, next) => {
    try{
        const {token} = req.headers;
        if(!token){
            return res.json({success: false, message: "Not Authorized, Login Again"});
        }
        // Verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if(token_decode.id !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            console.log(token_decode)
            return res.json({success: false, message: "Not Authorized, Login Again"});
        }
        
        next();
    }
    catch(error){
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

export default adminAuth;