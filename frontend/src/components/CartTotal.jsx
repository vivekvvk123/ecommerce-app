import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

function CartTotal() {

    const {currency, delivery_fee, getCartAmount} = useContext(ShopContext);




  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTAL'}/>
        </div>
        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency}{getCartAmount()}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency}
                    {getCartAmount() === 0 ? 0.00 : getCartAmount()>=500 ? 0.00 : delivery_fee}
                </p>
            </div>
            {
                getCartAmount() < 500 && getCartAmount() > 0 ? 
                <div>
                    <p className='text-red-500'>Add more items worth ₹{500 - getCartAmount()} to be eligible for free delivery!</p>
                </div> : null  
            }
            {
                getCartAmount() >= 500 ? 
                <div>
                    <p className='text-green-500'> Congratulations 🎉 you are eligible for free delivery!</p>
                </div> : null
            }

            <hr />

            <div className='flex justify-between text-xl'>
                <b>Total</b>
                <b>{currency} {getCartAmount() === 0 ? 0.00 : getCartAmount() >= 500 ? getCartAmount() : getCartAmount() + delivery_fee}.00</b>
            </div>

        </div>
    </div>
  )
}

export default CartTotal