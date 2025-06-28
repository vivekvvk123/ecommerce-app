import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 50;
    const freeDeliveryOver = 500;

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({});
    const navigate =  useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');



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

        if(token){
            try{
                await axios.post(backendUrl + '/api/cart/add',{itemId,size}, {headers:{token}});
            }
            catch(error){
                console.error(error);
                toast.error(error.message);
            }
        }
    }
    
    const getCartCount = () =>{
        let totalCount = 0;
        for(let item in cartItems){
            for(let size in cartItems[item]){
                try{
                    if(cartItems[item][size] > 0){
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

        if(token){
            try{
                await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers:{token}});
            }
            catch(error){
                console.error(error);
                toast.error(error.message);
            }
        }
    }

    // useEffect(()=>{
    //     console.log(cartItems)
    // },[cartItems])


    // cartItem looks like 
    // { "abc123": 
    //      { "M": 2, "L": 1 }, 
    // "xyz456": 
    //      { "S": 1 } }

    const getCartAmount = ()=>{
        let totalAmount =0;
        for(let items in cartItems){ 
            let itemInfo = products.find((product)=> product._id === items); 
            for(const size in cartItems[items]){
                try{
                    if(cartItems[items][size] > 0){
                        totalAmount += itemInfo.price * cartItems[items][size];
                    }
                }
                catch(error){
                }
            }
        }
        return totalAmount;
    }


    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if(response.data.success){
                setProducts(response.data.products);
            }
            else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }

    // get products data on initial render
    const getUserCart = async (token) => {
        try{
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers:{token}})
            if(response.data.success){
                setCartItems(response.data.cartData);
            }
        }
        catch(error){
            console.error(error);
            toast.error(error.message);
        }
    }


    useEffect(() => {
        getProductsData();
    },[])

    useEffect(() =>{
        if(!token && localStorage.getItem("token")){ // if token is not there but exists in localStorage
            setToken(localStorage.getItem("token"));
            getUserCart(localStorage.getItem("token"));
        }
    },[])

    useEffect(() => {
        if(token){
            localStorage.setItem("token", token);
            getUserCart(token);
        }else{
            setCartItems({});
            localStorage.removeItem("token");
        }
    }, [token])


    const value ={
        products, currency, delivery_fee, search, setSearch, showSearch, 
        setShowSearch, cartItems, setCartItems, addToCart,getCartCount,
        updateQuantity, getCartAmount, navigate, backendUrl,
        token, setToken
    }
    
    return (
        <ShopContext.Provider value = {value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;