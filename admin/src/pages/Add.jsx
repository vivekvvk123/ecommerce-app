import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App';

function Add({token}) {
    const [image1,setImage1] = useState(false);
    const [image2,setImage2] = useState(false);
    const [image3,setImage3] = useState(false);
    const [image4,setImage4] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Men');
    const [subCategory, setSubCategory] = useState('Topwear');
    const [bestSeller, setBestSeller] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async(e) => {
        e.preventDefault();
        setIsLoading(true);

        if(sizes.length === 0){
            toast.error('Please select at least one size');
            setIsLoading(false);
            return;
        }

        try{
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('subCategory', subCategory);
            formData.append('bestSeller', bestSeller);
            formData.append('sizes', JSON.stringify(sizes));

            image1 && formData.append('image1', image1);
            image2 && formData.append('image2', image2);
            image3 && formData.append('image3', image3);
            image4 && formData.append('image4', image4);


            const response = await axios.post(backendUrl + '/api/product/add', formData, {headers:{token}, timeout: 120000})

            if(response.data.success){
                toast.success(response.data.message);
                setName('');
                setDescription('');
                setPrice('');
                setImage1(false);
                setImage2(false);
                setImage3(false);
                setImage4(false);
                setCategory('Men');
                setSubCategory('Topwear');
                setBestSeller(false);
                setSizes([]);
            }
            else{
                toast.error(response.data.message);
            }

        }
        catch(err){
            console.error(err);
            toast.error('Something went wrong while adding the product.');
        }
        finally{
            setIsLoading(false);
        }
        
    }



  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
            <p className='mb-2'>Upload Image</p>
            <div className='flex gap-2'>
                <label htmlFor="image1">
                    <img className='w-24' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                    <input onChange={(e)=>setImage1(e.target.files[0])} type="file" name="" id="image1" hidden/>
                </label>
                <label htmlFor="image2">
                    <img className='w-24' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
                    <input onChange={(e)=>setImage2(e.target.files[0])} type="file" name="" id="image2" hidden/>
                </label>
                <label htmlFor="image3">
                    <img className='w-24' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
                    <input onChange={(e)=>setImage3(e.target.files[0])} type="file" name="" id="image3" hidden/>
                </label>
                <label htmlFor="image4">
                    <img className='w-24' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
                    <input onChange={(e)=>setImage4(e.target.files[0])} type="file" name="" id="image4" hidden/>
                </label>
            </div>
        </div>

        <div className='w-full'>
            <p className='mb-2'>Product Name</p>
            <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
        </div>
        <div className='w-full'>
            <p className='mb-2'>Product Description</p>
            <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write description here' />
        </div>
        <div className='mb-2 flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
            <div>
                <p className='mb-2'>Product Category</p>
                <select onChange={(e)=>setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                </select>
            </div>
            <div>
                <p className='mb-2'>Sub Category</p>
                <select onChange={(e)=>setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'>
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                </select>
            </div>
            <div>
                <p className='mb-2'>Product Price</p>
                <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[180px]' type="number" placeholder='enter price' required />
            </div>
        </div>
        <div className='flex flex-wrap gap-3 mb-2 '>
            <p className='mb-2'>Product Sizes</p>
            <div onClick={()=>setSizes(prev => prev.includes('S') ? prev.filter(item => item !== 'S') : [...prev, 'S'])}>
                <p className={`${sizes.includes('S') ? 'bg-gray-400' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>S</p>
            </div>
            <div onClick={()=>setSizes(prev => prev.includes('M') ? prev.filter(item => item !== 'M') : [...prev, 'M'])}>
                <p className={`${sizes.includes('M') ? 'bg-gray-400' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>M</p>
            </div>
            <div onClick={()=>setSizes(prev => prev.includes('L') ? prev.filter(item => item !== 'L') : [...prev, 'L'])}>
                <p className={`${sizes.includes('L') ? 'bg-gray-400' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>L</p>
            </div>
            <div onClick={()=>setSizes(prev => prev.includes('XL') ? prev.filter(item => item !== 'XL') : [...prev, 'XL'])}>
                <p className={`${sizes.includes('XL') ? 'bg-gray-400' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>XL</p>
            </div>
            <div onClick={()=>setSizes(prev => prev.includes('XXL') ? prev.filter(item => item !== 'XXL') : [...prev, 'XXL'])}>
                <p className={`${sizes.includes('XXL') ? 'bg-gray-400' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>XXL</p>
            </div>
        </div>
        <div className='flex gap-2 mb-2'>
            <input onChange={()=>setBestSeller(prev => !prev)} checked={bestSeller} type="checkbox" id='bestSeller' />
            <label className='cursor-pointer' htmlFor="bestSeller">Add to Bestseller</label>
        </div>

        <button className={`${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-black'} flex items-center justify-center gap-4 w-28 py-3 mt-4 text-white rounded`} type="submit">
            {isLoading && (<div className='animate-spin rounded-full h-4 w-4 border-white border-b-2'></div>)}Add</button>
    </form>
  )
}

export default Add