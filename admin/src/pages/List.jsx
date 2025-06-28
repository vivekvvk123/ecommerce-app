import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import axios from 'axios';
import { toast } from 'react-toastify';


function List({token}) {

  const [list, setList] = useState([])
  const currency = '₹';


  const fetchList = async () => {
    try{
      const response = await axios.get(backendUrl + '/api/product/list');
      // console.log(backendUrl)
        if(response.data.success){
          setList(response.data.products);
        }
        else{
          toast.error(response.data.message);
        }
      }
    catch(err){
      console.error(err);
      toast.error(err.message);
    }
  }

  const removeProduct = async (id) => {
    //prompt use to delete the product
    try{
      if(!window.confirm('Are you sure you want to delete this product?')){
        return;
      }
      const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}});
      if(response.data.success){
        toast.success(response.data.message);
        await fetchList();
      }
      else{
        toast.error(response.data.message);
      }
    }
    catch(err){
      console.error(err);
      toast.error(err.message);
    }

  }

  useEffect(() => {
    fetchList();
  },[])

  return (
    <>
      <p>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* List data Title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-300 bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* List data */}
        {
          list.map((item,index)=> (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-gray-300 text-sm' key={index} >
              <img className='w-12' src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <div className='flex justify-end md:justify-center items-center gap-2'>
                <p onClick={()=>{removeProduct(item._id)}} className='text-right md:text-center cursor-pointer text-lg w-8 rounded-full bg-zinc-300 hover:bg-zinc-400'>X</p>
              </div>
            </div>
          ))
        }
      </div>

    </>
  )
}

export default List