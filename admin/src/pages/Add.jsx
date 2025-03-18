import React from 'react'
import {assets} from '../assets/assets'
import { useState } from 'react'
import axios from 'axios'
//import {backendUrl} from '../APP'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types';

const Add = ({token}) => {
  const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });

  const [name,setName] = useState('');
  const [description,setDescription] = useState('');
  const [category,setCategory] = useState('Men');
  const [subCategory,setSubCategory] = useState('TopWear');
  const [price,setPrice] = useState('');
  const [sizes,setSizes] = useState([]);
  const [bestseller,setBestseller] = useState(false);



  const processImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const maxWidth = 800; // Resize max width
        const maxHeight = 800; // Resize max height
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width *= scale;
          height *= scale;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          callback(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
        }, 'image/jpeg', 0.7); // Quality 70%
      };
    };
  };

  const handleImageChange = (event, imageKey) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file, (compressedFile) => {
        setImages((prev) => ({ ...prev, [imageKey]: compressedFile }));
      });
    }
  };


  const onSubmitHandler =async (e) => {
    e.preventDefault();

    try{

      const formData=new FormData();
      formData.append('name',name);
      formData.append('description',description);
      formData.append('category',category);
      formData.append('subCategory',subCategory);
      formData.append('price',price);
      formData.append('sizes',JSON.stringify(sizes));
      formData.append('bestseller',bestseller); 

      Object.keys(images).forEach((key) => {
        if (images[key]) formData.append(key, images[key]);
      });

      const response =await axios.post("https://full-stack-e-commerce-backend.vercel.app"+"/api/product/add",formData,{headers:{token}});
      if(response.data.success){
        toast.success(response.data.message);
        setName('');
        setDescription(''); 
        setImages({ image1: null, image2: null, image3: null, image4: null });
        setPrice('')
      }else{
        toast.error(response.data.message);
      }


    }catch(error){
      console.log(error);
      toast.error(error.message);
    }

  }


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div >
        <p className ='mb-2'>Upload Image</p>
      <div className = 'flex gap-2'>
        {['image1', 'image2', 'image3', 'image4'].map((key, index) => (
            <label key={index} htmlFor={key}>
              <img className='w-20' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt='' />
              <input onChange={(e) => handleImageChange(e, key)} type='file' id={key} hidden />
            </label>
          ))}
      
    
      </div>
      </div>
      <div className ='w-full'>
        <p>Product Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 ' type ='text' placeholder='Type Here' required />
      </div>

      <div className ='w-full'>
        <p>Product Description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 ' type ='text' placeholder='Write Content Here' required />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
      <div>
        <p className='mb-2'>Product Category</p>
        <select onChange={(e)=>setCategory(e.target.value)} className='w-full max-w-[500px] px-3 py-2 ' required>
          <option value='Men'>Men</option>
          <option value='Women'>Women</option>
          <option value='Kids'>Kids</option>
        </select>
      </div>

      

      <div>
        <p className ='mb-2'>Product SubCategory</p>
        <select onChange={(e)=>setSubCategory(e.target.value)}className='w-full max-w-[500px] px-3 py-2 ' required>
          <option value='TopWear'>TopWear</option>
          <option value='BottomWear'>BottomWear</option>
          <option value='WinterWear'>WinterWear</option>
        </select>
      </div>
      <div>
        <p className=' mb-2'>Product Price</p>
        <input onChange={(e)=>setPrice(e.target.value)} className='w-full max-w-[180px] px-2 py-2 ' type ='number' placeholder='0' required />
      </div>
      </div>
      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          <div onClick={()=>setSizes(prev=>prev.includes("S") ? prev.filter(item=>item!=="S"): [...prev,"S"])}>
            <p className={`${sizes.includes("S") ? 'bg-blue-200':'bg-slate-200'} px-3 py-1 cursor-pointer`}>S</p>
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("M") ? prev.filter(item=>item!=="M"): [...prev,"M"])}>
            <p className={`${sizes.includes("M") ? 'bg-blue-200':'bg-slate-200'} px-3 py-1 cursor-pointer`}>M</p>
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("L") ? prev.filter(item=>item!=="L"): [...prev,"L"])}>
            <p className={`${sizes.includes("L") ? 'bg-blue-200':'bg-slate-200'} px-3 py-1 cursor-pointer`}>L</p>
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("XL") ? prev.filter(item=>item!=="XL"): [...prev,"XL"])}>
            <p className={`${sizes.includes("XL") ? 'bg-blue-200':'bg-slate-200'} px-3 py-1 cursor-pointer`}>XL</p>
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("XXL") ? prev.filter(item=>item!=="XXL"): [...prev,"XXL"])}>
            <p className={`${sizes.includes("XXL") ? 'bg-blue-200':'bg-slate-200'} px-3 py-1 cursor-pointer`}>XXL</p>
          </div>
        </div>
      </div>

      <div className ='flex gap-2 mt-2'>
        <input onChange={()=>setBestseller(prev=>!prev)} checked={bestseller} type="checkbox" id='bestseller'/>
        <label className='cursor-pointer' htmlFor='bestseller'>Add to BestSeller</label>
      </div>

      <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>

    </form>

    
  )
}
Add.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Add
