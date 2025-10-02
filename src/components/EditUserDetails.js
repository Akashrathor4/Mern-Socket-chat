import React, { useEffect, useRef, useState } from 'react'
import { Avatar } from './Avatar'
import { uploadFile } from '../helper/uploadFile'
import { Divider } from './Divider'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'

export const EditUserDetails = ({onClose,user}) => {
       const [data,setData] = useState({
           name : user?.name,
           profile_pic : user?.profile_pic
       })
       const uploadPhotoRef = useRef();
       const dispatch = useDispatch();

       useEffect(()=>{
           setData((prev)=>{
               return {
                 ...prev,
                 ...user
               }
           })
       },[user])

       const handleOnChange = (e) =>{
                const {name,value} = e.target

                setData((prev)=>{
                    return{
                       ...prev,
                       [name] : value
                    }
                })
       }

       const handleUplaodPhoto = async(e)=>{
              const file = e.target.files[0]
               
                    const uploadPhoto = await uploadFile(file)
              
                       // console.log("uploadPhoto",uploadPhoto)
                    setData((prev)=>{
                           return{
                             ...prev,
                             profile_pic : uploadPhoto?.url
                           }
                    })
              
       }

       const handleOpenUploadPhoto = (e) =>{
                e.preventDefault()
              e.stopPropagation()
                uploadPhotoRef?.current?.click()
       }

       const handleSubmit = async(e)=>{
              e.preventDefault()
              e.stopPropagation()
              try {
                  const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`
                    
                  const response = await axios.post(
                    URL,
                    data,
                    {withCredentials : true}
                  )
                  
                  toast.success(response?.data?.message)
                  
                  if(response?.data?.success){
                       dispatch(setUser(response?.data?.data))
                  }
             
                } catch (error) {
                   toast.error(error?.response?.data?.message)
              }

              onClose();
       }

  return (
    <div className=' fixed top-0 bottom-0 right-0 left-0  bg-gray-700 bg-opacity-70 z-40 flex justify-center items-center '>
          <div className='bg-white p-4 py-7 m-1 rounded-md w-full max-w-sm'>
                 <h2 className='font-semibold'>Profile Details</h2>
                 <p className='text-sm'>Edit User Details</p>
          
                 <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                       <div className='flex flex-col gap-1'>
                            <label htmlFor='name'>Name :</label>
                            <input 
                                    type='text'
                                    name='name'
                                    id='name'
                                    value={data.name}
                                    onChange={handleOnChange}
                                    className='w-full  focus:outline-primary border font-semibold'
                            />
                       </div> 

                       <div>
                              <div>Profile :</div>
                              <div className='mt-1 flex items-center gap-4 '>
                                 <Avatar
                                    width={32}
                                    height={32}
                                    name = {data?.name}
                                    imageUrl={data?.profile_pic}
                                 />
                                 <label htmlFor='profile_pic'>
                                    <button onClick={handleOpenUploadPhoto} className='font-semibold'>Edit Profile</button>
                                    <input
                                        type='file'
                                        id='profile_pic'
                                        className = 'hidden'
                                        onChange={handleUplaodPhoto}
                                        ref={uploadPhotoRef}
                                    />
                                 </label>
                              </div>
                              
                       </div> 
                       <Divider/>
                       <div className='flex gap-4 justify-end '>
                           <button onClick={onClose} className='border-primary border px-4 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black'>Cancel</button>
                           <button type='submit' className='border-primary border px-4 py-1 rounded-md bg-primary hover:bg-secondary text-white'>Save</button>

                       </div>   
                       
                 </form>
          </div>
    </div>
  )
}

