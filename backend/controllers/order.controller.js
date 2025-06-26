import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";

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

}


// Placing order using Razorpay

const placeOrderRazorpay = async (req, res) => {

}


// All orders data for Admin user
const allOrders = async (req, res) => {
    
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
    

// Update Order Status
const updateStatus = async (req, res) => {

}


export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus };