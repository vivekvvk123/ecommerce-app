import React, {useEffect} from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';


function Verify() {

    const {navigate, token, setCartItems, backendUrl} = useContext(ShopContext);
    const [searchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () =>{
        try{
            if(!token){
                return;
            }
            const response = await axios.post(backendUrl + '/api/order/verifyStripe', {success, orderId}, {headers:{token}})
            // console.log(response.data);
            if(response.data.success){
                setCartItems({});
                navigate('/orders');
            }
            else{
                navigate('/cart');
            }
        }
        catch(error){
            console.error(error);
            toast.error(error.message);
        }
    }

    useEffect(()=>{
       verifyPayment(); 
    },[token])

  return (
    <div>Verify</div>
  )
}

export default Verify