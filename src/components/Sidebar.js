import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import { Avatar } from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { EditUserDetails } from './EditUserDetails';
import { Divider } from './Divider';
import { FiArrowUpLeft } from "react-icons/fi";
import { SearchUser } from './SearchUser';
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import moment from 'moment'
import {logout} from '../redux/userSlice'





export const Sidebar = () => {

   const user = useSelector(state => state?.user)

   const [editUserOpen,setEditUserOpen] = useState(false)
   const [allUser,setAllUser] = useState([])
   const [openSearchUser,setOpenSearchUser] = useState(false)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const socketConnection = useSelector(state=>state?.user?.socketConnection)

   useEffect(()=>{
          if(socketConnection){
            socketConnection.emit('sidebar',user?._id)
             
            socketConnection.on('conversation',(data)=>{
                    //  console.log('conversation',data)
                     
                     const conversationUserData = data.map((conversationUser,index)=>{
                                if(conversationUser?.sender === conversationUser?.receiver?._id ){
                                  return{
                                     ...conversationUser,
                                     userDetails : conversationUser?.sender
                                  }
                                }
                                else if(conversationUser?.receiver?._id !== user?._id){
                                 
                                    return {
                                      ...conversationUser,
                                      userDetails : conversationUser.receiver
                                    }
                                 
                                }
                                else{
                                  return {
                                     ...conversationUser,
                                     userDetails : conversationUser.sender
                                  }
                                }
                     })


                    setAllUser(conversationUserData)
            })

          }


    },[socketConnection,user,allUser])

    const handleLogout = ()=>{
        // FIX: Clear localStorage FIRST to prevent race conditions 
        // with Redux Persist trying to write to the storage it just deleted.
        
        dispatch(logout()) 
        navigate('/email') 
        localStorage.clear()    
    }


  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr]'>
         <div className='bg-slate-200  flex flex-col justify-between items-center  w-12 h-full rounded-tr-lg rounded-br-lg py-5   '>
             <div className='gap-3 flex flex-col items-center' >
                    <NavLink
                    
                        title="chat"
                        className={({ isActive }) =>
                            `w-10 h-10 flex justify-center items-center rounded-md cursor-pointer 
                            hover:bg-slate-400 ${isActive ? "bg-slate-400" : ""}`
                        }
                        >
                        <IoChatbubbleEllipses size={20} />
                    </NavLink>

                    <div onClick={()=>setOpenSearchUser(true)} className='w-10 h-10 flex justify-center items-center rounded-md cursor-pointer hover:bg-slate-400 ' title='Add Friend'>
                        <FaUserPlus size={20}/>
                    </div>
             </div>

             <div className='gap-3 flex flex-col items-center'>

                  <button className='w-10 h-10 flex justify-center items-center rounded-md cursor-pointer hover:bg-slate-400 ' title={user?.name} onClick={()=>setEditUserOpen(true)}>
                    <Avatar
                        width={32}
                        height={32}
                        name = {user.name}
                        imageUrl={user?.profile_pic}
                        userId={user?._id}
                    />
                  </button>

                  <button className='w-10 h-10 flex justify-center items-center rounded-md cursor-pointer hover:bg-slate-400 ' title='Logout' onClick={handleLogout}>
                        <span className='-ml-2'>
                            <BiLogOut
                              size={20}
                            />
                        </span>
                    
                  </button>
             </div>
         </div>

         <div className='w-full p-4'>
              <div className='w-full h-10'>
                <h2 className='text-2xl font-bold text-slate-800 '>Chats</h2>
              </div>
              <div className='p-[0.5px] bg-slate-200'>
                   
              </div>
              
              <div className=' mt-0.5 h-[calc(100vh-90px)]  w-full overflow-x-hidden overflow-y-auto scrollbar'>
                  {
                    allUser.length === 0 && (
                      <div>
                            <div className='flex justify-center items-center text-slate-500 mt-14 mb-6'>
                               <FiArrowUpLeft
                                size={40}
                               />
                            </div>
                            <p className='text-lg text-center text-slate-400'>
                              Explore Users To Start Conversation with.
                            </p>

                      </div>
                    )
                  }
                  {
                        allUser.map((conv,index)=>{
                                 return(
                                     <NavLink to={'/'+conv?.userDetails?._id} key={conv?._id} className='flex items-center justify-between gap-2 p-2 hover:bg-slate-300 rounded-md'>
                                             <div className='flex items-center justify-center gap-2'>
                                              <div>
                                               <Avatar
                                                  imageUrl={conv?.userDetails?.profile_pic}
                                                  name={conv?.userDetails?.name}
                                                  width={35}
                                                  height={35}
                                               />
                                             </div>
                                             <div className='min-w-0 overflow-hidden'>
                                                <h3 className='text-ellipsis line-clamp-1 font-semibold'>
                                                    {conv?.userDetails?.name}
                                                </h3>
                                                <div className='text-xs text-slate-500 '>
                                                  {/* The logic:
                                                    1. Check for Image/Video AND Text
                                                    2. ELSE Check for ONLY Image
                                                    3. ELSE (optional, can be text only, or nothing if you only want to render for media)
                                                  */}

                                                  {/* 1. If image/video AND text are both present: */}
                                                  {(conv?.lastMsg?.imageUrl || conv?.lastMsg?.videoUrl) && conv?.lastMsg?.text ? (
                                                    <div className='flex items-center gap-1 '>
                                                      <span>
                                                        {conv?.lastMsg?.imageUrl ? <FaImage/> : <FaVideo/>}
                                                      </span>
                                                      <span>{conv?.lastMsg?.text}</span>
                                                    </div>
                                                  ) : 
                                                  
                                                  /* 2. ELSE IF only image is present: */
                                                  conv?.lastMsg?.imageUrl ? (
                                                    <div className='flex items-center gap-1'>
                                                      <span className='flex items-center gap-1'>
                                                        <span><FaImage/></span>
                                                        <span>Image</span>
                                                      </span>
                                                    </div>
                                                  ) :
                                                  
                                                  /* 3. ELSE (Default case, e.g., only text, or no last message): */
                                                  conv?.lastMsg?.videoUrl ? (
                                                    
                                                    <div className='flex items-center gap-1'>
                                                      <span className='flex items-center gap-1'>
                                                        <span><FaVideo/></span>
                                                        <span>Video</span>
                                                      </span>
                                                    </div>

                                                  ) : (
                                                    // Render text if none of the above conditions are met
                                                     <div className='text-ellipsis line-clamp-1' >{conv?.lastMsg?.text }</div> 
                                                  )}

                                                </div>
                                             </div>
                                             </div>
                                             <div >
                                                <div className='flex flex-col text-xs mt-1 gap-1 '>
                                                  <div className='text-xs ml-auto  w-fit  leading-0.5 text-green-600    '>{moment(conv?.lastMsg?.createdAt).format('hh:mm')}</div>
                                                  {
                                                    Boolean(conv?.unseenMsg) && (
                                                           <div className=' flex items-center justify-center h-[20px] w-[20px] text-[11px] rounded-full p-1 mx-auto bg-green-600'>{conv?.unseenMsg}</div>
                                                    )
                                                  }
                                              </div>
                                             </div>
                                     </NavLink>
                                 )
                        })
                  }

              </div>


         </div>


          {/* search user   */}
                
         
          {

             openSearchUser && (
                 <SearchUser onClose= {()=>setOpenSearchUser(false )} />
             )
           
          }
          
           {/* edit user details modal  */}
         {
            editUserOpen && (
                <EditUserDetails onClose= {()=>setEditUserOpen(false)} user={user} />
            )
         }
         {/* this is used when a modal or drawer needs to tell the parent “I’m closing now”. inside edituserdetails you can access it via props.onClose */}
         {/* Inside the child, onClose is just a prop (a function).
          When you click Close, the child calls onClose().
          This triggers the parent’s function → setEditUserOpen(false).
          That re-renders parent → modal disappears. */}
          {/* state define and own by parent , child only call function  */}

          {/* here we use lifting state up concept */}

           
    </div>
  )
}
