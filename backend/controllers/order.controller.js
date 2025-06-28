import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import Stripe from 'stripe';

// global variables
const currency = 'inr';
const deliveryCharge = 10;

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Placing order using COD
const placeOrder = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
        }
        const newOrder = await orderModel(orderData);
        await newOrder.save();
        
        await userModel.findByIdAndUpdate(userId, {cartData: {}});

        res.json({success: true, message: 'Order Placed'})
    }
    catch (error){
        console.error("Error placing order:", error);
        res.status(500).json({success: false, message: error.message});
    }
}

// Placing order using Stripe
const placeOrderStripe  = async (req, res) => {
    try{
        const {userId, items, amount, address} = req.body;
        const {origin} = req.headers;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now(),
        }
        const newOrder = await orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item)=>({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }))
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true, session_url: session.url});

    }
    catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

// Verify stripe payment
const verifyStripe = async(req,res)=>{
    const {orderId, success, userId} = req.body;
    try{
        if(success === 'true'){
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}});
            res.json({success: true})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false})
        }
    }
    catch (error) {
        console.error(error);
        res.json({success:false, message: error.message});
    }

}


// Placing order using Razorpay

const placeOrderRazorpay = async (req, res) => {

}


// All orders data for Admin user
const allOrders = async (req, res) => {
    try{
        const orders = await orderModel.find({});
        res.json({success: true, orders});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }

}


// User order data for frontend
const userOrders = async (req, res) => {
    try{
        const {userId} = req.body;
        const orders = await orderModel.find({userId});
        res.json({success:true, orders});

    }
    catch (error) {
        console.error("Error fetching user orders:", error);
        res.json({success: false, message: error.message});
    }
}
    

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
     try{
        const {orderId, status} = req.body;
        await orderModel.findByIdAndUpdate(orderId, {status});
        res.json({success:true, message: 'Status Updated'})
    }
    catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}


export {verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus };