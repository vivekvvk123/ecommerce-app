import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function PlaceOrder() {

  const [method, setMethod] = useState('cod');
  const {navigate, token,backendUrl,cartItems, setCartItems, freeDeliveryOver, delivery_fee, products, getCartAmount} = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData(prevData => ({...prevData, [name]: value}))
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard           
      amount: order.amount,
      currency:order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) =>{
        try{
          const verificationResponse = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, {headers:{token}});
          // console.log(verificationResponse)
          if(verificationResponse.data.success){
            navigate('/orders');
            setCartItems({});
          }
        }
        catch(error){
          console.error(error);
          toast.error(error.message);
        }
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let orderItems = [];
      for (let items in cartItems) {
        for (let size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[items][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

        //   console.log(orderItems);

      let orderData = {
          address:formData,
          items: orderItems,
          amount: getCartAmount()
      }

        switch(method){
            case 'cod':
                const response = await axios.post(backendUrl + '/api/order/place',orderData, {headers:{token}})                
                if(response.data.success){
                    setCartItems({});
                    navigate('/orders');
                }else{
                    toast.error(response.data.message);
                }
                break;
            case 'stripe':
                const stripeResponse = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers:{token}});
                console.log(stripeResponse.data);
                if(stripeResponse.data.success){
                  const {session_url} = stripeResponse.data;
                  window.location.replace(session_url);
                }
                else{
                  toast.error(stripeResponse.data.message);
                }
                break;

            case 'razorpay':
                const razorpayResponse = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers:{token}});
                if(razorpayResponse.data.success){
                  initPay(razorpayResponse.data.order);
                }
                else{
                  toast.error(razorpayResponse.data.message);
                }

                break;

            default:
                break;
        }

    } catch (error) {
      console.error("Error placing order:", error);
    }
    finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        {/* Left side */}
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='pinCode' value={formData.pinCode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='PIN Code' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />

      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12 '>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>

          {/* Payment methods */}
          <div className='flex gap-3 flex-col  lg:flex-row'>
            <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-blue-700' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={()=>setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-blue-700' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-blue-700' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>Cash on Delivery</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className={`${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-black'} text-white py-3 px-12 text-sm flex items-center justify-center gap-4`}>
              {isLoading && (<div className='animate-spin rounded-full h-4 w-4 border-white border-b-2'></div>)} Place Order</button>
          </div>

        </div>

      </div>
    </form>
  )
}

export default PlaceOrder