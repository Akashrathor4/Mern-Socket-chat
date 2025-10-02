import React, { useState } from 'react'
import {uploadFile} from '../helper/uploadFile'
import { RxCross1 } from "react-icons/rx";
import { Link } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const RegisteredUser = () => {

   const[data,setData] = useState({
      name :"",
      email :"",
      password :"",
      profile_pic :""
   })

   const [uploadPhoto,setUploadPhoto] = useState("");
   const navigate = useNavigate()

   const handleOnChange = (e)=>{
             const{name,value} = e.target

             setData((prev)=>{
              return{
                ...prev,
                [name] : value
              }
             })
   }

   const handleUploadPhoto = async(e) =>{
      const file = e.target.files[0]
 
      const uploadPhoto = await uploadFile(file)

      // console.log("uploadPhoto",uploadPhoto)


      setUploadPhoto(file)

      setData((prev)=>{
             return{
               ...prev,
               profile_pic : uploadPhoto?.url
             }
      })

   }

   const handleClearUploadPhoto = (e)=>{
               setUploadPhoto(null)
               e.preventDefault()
               e.stopPropagation()
   }

   console.log("uploadPhoto",  )

   const handleSubmit = async(e)=>{
      e.preventDefault()
      e.stopPropagation()

      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/registered`
      
      try {
         console.log('BackEnd Call gone')
         const response = await axios.post(URL,data)
          console.log('BackEnd Call Comes Back')
         console.log("response",response)

          toast.success(response.data.message || "Registered successfully");
           console.log("response.data.message",response.data.message)
          if(response.data.message){
              
            setData({
                  name :"",
                  email :"",
                  password :"",
                  profile_pic :""
               }) 

               navigate('/email')
          }
      } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong");
         //  console.log("error",error)
      }
      
      console.log("data",data);
   }

  return (
    <div className='mt-5 '>
       <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto '>
          <h3>Welcome to Chat App</h3>
      
          <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
             <div className='flex flex-col gap-1'>
              <label htmlFor='name'>Name :</label>
              <input 
                  type='text'        
                  id='name'
                  name='name'
                  value={data.name}  
                  placeholder='Enter Your Name'
                  className='bg-slate-100 px-2 py-1'
                  onChange={handleOnChange}
                  required
              />
             </div>

             <div className='flex flex-col gap-1'>
              <label htmlFor='email'>Email :</label>
              <input 
                  type='email'        
                  id='email'
                  name='email'
                  value={data.email}  
                  placeholder='Enter Your Email'
                  className='bg-slate-100 px-2 py-1'
                  onChange={handleOnChange}
                  required
              />
             </div>

             <div className='flex flex-col gap-1'>
              <label htmlFor='email'>Password :</label>
              <input 
                  type='password'        
                  id='password'
                  name='password'
                  value={data.password}  
                  placeholder='Enter Your Password'
                  className='bg-slate-100 px-2 py-1'
                  onChange={handleOnChange}
                  required
              />
             </div>

             <div className='flex flex-col gap-1'>
              <label htmlFor='profile_pic'>Profile :
              
              <div className='h-14 bg-slate-200 flex justify-center items-center  border-slate-800 rounded hover:border-2 cursor-pointer'>
                 <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                       {
                            uploadPhoto?.name ? uploadPhoto.name : "Uplaod Profile Picture"
                       }
                 </p>
                 {
                    uploadPhoto?.name && (
                            <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                              <RxCross1 />
                           </button> 
                    )
                 }
                 
              </div>
              
              </label>
              <input 
                  type='file'        
                  id='profile_pic'
                  name='profile_pic'
                  className='bg-slate-100 px-2 py-1 hidden'
                  onChange={handleUploadPhoto}
              />
             </div>

             <button
             className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded-md mt-4  font-bold text-white leading-relaxed tracking-wide'
             >
               Register
             </button>
          </form>
         
         <p  className='my-3 text-center '>Already Have Acoount ? <Link to={"/email"} className='hover:text-primary  font-semibold'>Login</Link></p>

       </div>
    </div>
  )
}
