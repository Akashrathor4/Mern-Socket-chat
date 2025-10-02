import React, { useEffect, useState } from 'react'
import {uploadFile} from '../helper/uploadFile'
import { RxCross1 } from "react-icons/rx";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { Avatar } from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';

export const CheckPasswordPage = () => {

const[data,setData] = useState({
      
      password :"",
     
   })
   const navigate = useNavigate()

   const location = useLocation()
   console.log("location",location)
   const dispatch = useDispatch()

   useEffect(()=>{
     if(!location?.state?.name){
      navigate('/email')
     }
   },[])

   const handleOnChange = (e)=>{
             const{name,value} = e.target

             setData((prev)=>{
              return{
                ...prev,
                [name] : value
              }
             })
   }

   const handleSubmit = async(e)=>{
      e.preventDefault()
      e.stopPropagation()

      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`
      console.log("Backend URL:", URL);

      
      try {
          console.log("data.password : ",data.password)
          console.log("location?.state?._id",location?.state?._id)
         const response = await axios.post(URL,{
            password: data.password,
            userId: location?.state?._id   // 👈 add userId here
          }, {
            withCredentials: true
          }) 
         
         console.log("response",response)

          toast.success(response.data.message || "Password verified");

          

           console.log("response.data.message",response.data.message)
          if(response.data.success){
              
            setData({
                  password :""
               }) 
               
            dispatch(setToken(response?.data?.token))
            //also add that token to localstorage
            localStorage.setItem("token",response?.data?.token)   

               navigate('/')
          }
      } catch (error) {
          console.log("error.response?.data?.message : ",error.response?.data?.message);
          toast.error(error.response?.data?.message || "Something went wrong");
         //  console.log("error",error)
      }
      
      
   }



  return (
    <div className='mt-5 '>
           <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto '>
              
              <div className='w-fit mx-auto mb-2 flex flex-col justify-center items-center'>
                 {/* <HiOutlineUserCircle  
                  size={80} */}
                  <Avatar
                    width={70}
                    height={70}
                    name={location?.state?.name}
                    imageUrl={location?.state?.profile_pic}
                  />
                  <h2 className='font-semibold text-lg mt-1'>
                    {location?.state?.name}
                  </h2>
              </div>
              
             
          
              <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>

    
                 <div className='flex flex-col gap-1'>
                  <label htmlFor='password'>Password :</label>
                  <input 
                      type='password'        
                      id='password'
                      name='password'
                      value={data.password}  
                      placeholder='Enter Your password'
                      className='bg-slate-100 px-2 py-1'
                      onChange={handleOnChange}
                      required
                  />
                 </div>
    
                 
    
                 
    
                 <button
                 className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded-md mt-4  font-bold text-white leading-relaxed tracking-wide'
                 >
                   Next
                 </button>
              </form>
             
             <p  className='my-3 text-center '> <Link to={"/forget-password"} className='hover:text-primary  font-semibold'>Forget Password?</Link></p>
    
           </div>
    </div>
  )
}




