import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 50;

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({});

    const addToCart = async(itemId, size)=>{

        if(!size){
            toast.error('Please select a size');
            return;
        }

        let cartData = structuredClone(cartItems); // deep copy of cartItems
        if(cartData[itemId]){  //if item already exists in cart

            if(cartData[itemId][size]){ //if size already exists for the item
                cartData[itemId][size] += 1; 
            }
            else{
                cartData[itemId][size] = 1; 
            }
        }else{ //if item does not exist in cart
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
    }
    
    const getCartCount = () =>{
        let totalCount = 0;
        for(let item in cartItems){
            for(let size in cartItems[item]){
                try{
                    if(cartItems[item][size]){
                        totalCount += cartItems[item][size];
                    }
                }catch(error){
                    toast.error("Error calculating cart count");
                }

            }
        }
        return totalCount;
    }

    const updateQuantity = async(itemId, size, quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;

        setCartItems(cartData);
    }

    // useEffect(()=>{
    //     console.log(cartItems)
    // },[cartItems])

    const getCartAmount = ()=>{
        let totalAmount =0;
        for(let items in cartItems){
            let itemInfo = products.find((product)=> product._id === items); 
            for(const size in cartItems[items]){
                if(cartItems[items][size] > 0){
                    totalAmount += itemInfo.price * cartItems[items][size];
                }
            }
        }
        return totalAmount
    }




    const value ={
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch, cartItems, addToCart,getCartCount, updateQuantity, getCartAmount
    }
    
    return (
        <ShopContext.Provider value = {value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;