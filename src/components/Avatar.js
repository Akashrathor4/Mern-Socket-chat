import React from 'react'
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useSelector } from 'react-redux';

export const Avatar = ({userId,name,imageUrl,width,height}) => {
    const onlineUser = useSelector(state=>state?.user?.onlineUser)
    let avatarName = ""

    if(name){
        const splitName = name?.split(" ")

        if(splitName.length >1){
            avatarName = splitName[0][0] + splitName[1][0]
        }else{
           avatarName = splitName[0][0]  
        }
    }

    const bgColor = [
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-yellow-200',
        'bg-gray-200',
        'bg-cyan-200',
        'bg-sky-200',
        'bg-blue-200',
    ]
    
    const randomNumber = Math.floor(Math.random()*9)
    
     const isOnline = onlineUser.includes(userId)
    return (
    <div className={`text-slate-800 relative overflow-hidden  rounded-full font-bold `} style={{width : width+"px",height : height+"px"}}>
        {
           imageUrl ? (
            <img
               src={imageUrl}
               width={width}
               height={height}
               alt={name}
               className='overflow-hidden rounded-full' 
            />
           ): (
            name ? (
                  <div style={{width : width+"px",height : height+"px"}} className={`overflow-hidden rounded-full flex justify-center text-lg items-center ${bgColor[randomNumber]}`}>
                      {avatarName} 
                  </div>
            ):(
                <div className='w-fit mx-auto mb-2'>
                                 <HiOutlineUserCircle  
                                  size={width}
                                 />
                </div>
            )
           )
        }
        {
             isOnline && (
                <div className='bg-green-500 p-1 absolute bottom-1 right-0 z-12 rounded-full'></div>
             )
        }
    </div>
  )
}
