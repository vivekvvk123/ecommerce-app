import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

function ProductItem({id, image, name, price}) {

    const {currency} = useContext(ShopContext);


  return (
    <div className='hover:shadow-md p-2 rounded border border-gray-300'>
        <Link to={`/product/${id}`} className='text-gray-700 cursor-pointer '>
        <div className='overflow-hidde'>
            <img className='hover:scale-110 transition ease-in-out min-h-60' src={image[0]} alt="" />
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
        </Link>

    </div>
  )
}

export default ProductItem