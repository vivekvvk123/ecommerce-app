import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import Stripe from 'stripe';
import razorpay from 'razorpay';
import {sendOrderConfirmationEmail} from '../services/emailService.js';

// global variables
const currency = 'inr';
const deliveryCharge = 50;
const freeDeliveryOver = 500;

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})



// Placing order using COD
const placeOrder = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;
        
        // Validate required fields
        if(!userId || !items || items.length === 0 || !amount || !address) {
            return res.json({success: false, message: 'Missing required fields or empty cart'});
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        
        await userModel.findByIdAndUpdate(userId, {cartData: {}});

        // Send order confirmation email
        const emailData = {
            userEmail: address.email,
            userName: address.firstName,
            orderId: newOrder._id,
            items: items,
            totalAmount: amount,
            shippingAddress: address,
            paymentMethod: 'Cash on Delivery',
        }
        sendOrderConfirmationEmail(emailData).catch((error) =>{
            console.error("Error sending order confirmation email from controller", error);
        })

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

        // Validate required fields
        if(!userId || !items || items.length === 0 || !amount || !address) {
            return res.json({success: false, message: 'Missing required fields or empty cart'});
        }

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
        const newOrder = new orderModel(orderData);
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
        if(amount < freeDeliveryOver){
             line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        })}
       

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        // Send order confirmation email
        // const emailData = {
        //     userEmail: address.email,
        //     userName: address.firstName,
        //     orderId: newOrder._id,
        //     items: items,
        //     totalAmount: amount,
        //     shippingAddress: address,
        //     paymentMethod: 'Stripe',
        // }
        // sendOrderConfirmationEmail(emailData).catch((error) =>{
        //     console.error("Error sending order confirmation email from controller", error);
        // })

        res.json({success:true, session_url: session.url});

    }
    catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

// Verify stripe payment
const verifyStripe = async(req,res)=>{
    const {orderId, success, userId, address} = req.body;
    try{
        if(success === 'true'){
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}});

            // Send order confirmation email
            const order = await orderModel.findById(orderId);
            const emailData = {
                userEmail: order.address.email,
                userName: order.address.firstName,
                orderId: order._id,
                items: order.items,
                totalAmount: order.amount,
                shippingAddress: order.address,
                paymentMethod: 'Stripe',
            }
            sendOrderConfirmationEmail(emailData).catch((error) =>{
                console.error("Error sending order confirmation email from controller", error);
            })

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
    try{
        const {userId, items, amount, address} = req.body;
        // Validate required fields
        if(!userId || !items || items.length === 0 || !amount || !address) {
            return res.json({success: false, message: 'Missing required fields or empty cart'});
        }
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now(),
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: (amount > freeDeliveryOver ? amount : amount + deliveryCharge)  * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        }

        await razorpayInstance.orders.create(options, (err, order) => {
            if(err){
                console.log(err);
                return res.json({success: false, message: err})
            }
            res.json({success:true, order})
        })

        // Send order confirmation email
        // const emailData = {
        //     userEmail: address.email,
        //     userName: address.firstName,
        //     orderId: newOrder._id,
        //     items: items,
        //     totalAmount: amount,
        //     shippingAddress: address,
        //     paymentMethod: 'Razorpay',
        // }
        // sendOrderConfirmationEmail(emailData).catch((error) =>{
        //     console.error("Error sending order confirmation email from controller", error);
        // })

    }
    catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

// Verify Razorpay payment

const verifyRazorpay = async (req,res) =>{
    try{
        const {userId, razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        // console.log(orderInfo);
        if(orderInfo.status === 'paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}});

            // Send order confirmation email
            const order = await orderModel.findById(orderInfo.receipt);
            const emailData = {
                userEmail: order.address.email,
                userName: order.address.firstName,
                orderId: order._id,
                items: order.items,
                totalAmount: order.amount,
                shippingAddress: order.address,
                paymentMethod: 'Stripe',
            }
            sendOrderConfirmationEmail(emailData).catch((error) =>{
                console.error("Error sending order confirmation email from controller", error);
            })

            res.json({success:true, message:"Payment Successful"})
        }else{
            res.json({success:false, message:"Payment Failed"})
        }

    }
    catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
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


export {verifyStripe, verifyRazorpay, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus };