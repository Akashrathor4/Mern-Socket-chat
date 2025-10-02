import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Avatar } from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { uploadFile } from '../helper/uploadFile';
import {Spinner} from './Spinner'
import { IoClose } from "react-icons/io5";
import backgroundImage from '../assets/wallapaper.jpeg'
import { LuSend } from "react-icons/lu";
import moment from 'moment'
import {ImageViewer} from './ImageViewer'

export const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state=>state?.user?.socketConnection)
  const user = useSelector(state=>state?.user)
  const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false)
  
  // initial yha honge saare mesage phir enhe backend socket me bheja jayega database me save krenge and again backend frontend ko send krenga jo allmessage wale use state me save hoga
  const [message,setMessage] = useState({
         text :"",
         imageUrl :'',
         videoUrl :''
  })
  const [loading,setLoading] = useState(false)
  // to show all message from socket send by sender to show in chat area
  // ye saare message honge all message 
  const [allMessages,setAllMessages] = useState([])
  //now scroll nhi ho rha message jane ka to uske useRef
  const currentMessage = useRef()
  console.log( 'currentMessage', currentMessage)
  // useeffect use for current message scroll jab bhi allMessage me new entry aayegi
   useEffect(()=>{
         if(currentMessage.current){
              currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
         }  
   },[allMessages])


   const [imageViewOpen ,setImageViewOpen ] = useState(false)
   const [currentImageUrl,setCurrentImageUrl] = useState('')  

  const [dataUser,setDataUser] = useState({
    name :'',
    email :'',
    profile_pic :'',
    online :false,
    _id :''
  }) 


  // console.log("socketConnection",socketConnection)

  // console.log("Param",params.userId)

  const handlerImageVideoUpload = ()=>{
             
             setOpenImageVideoUpload(prev => !prev)
  }

  const handleUploadImage = async(e)=>{
            const file = e.target.files[0]
              setOpenImageVideoUpload(false)
              setLoading(true)
            const uploadPhoto = await uploadFile(file)
              setLoading(false)
            
            
            setMessage(prev =>{
               return{
                ...prev,
                imageUrl : uploadPhoto.url
               }
            })   
  }

  const handleUploadVideo = async(e)=>{
            const file = e.target.files[0]
             setOpenImageVideoUpload(false)
             setLoading(true)
            const uploadVideo = await uploadFile(file)
             setLoading(false)
            setMessage(prev =>{
               return{
                ...prev,
                videoUrl : uploadVideo.url
               }
            }) 
  }

  const handleClearUploadImage = ()=>{
       setMessage(prev =>{
               return{
                ...prev,
                imageUrl : ''
               }
            }) 
  }

  const handleClearUploadVideo = ()=>{
         setMessage(prev =>{
               return{
                ...prev,
                videoUrl : ''
               }
            }) 
  }

  const handlerOnChange = (e)=>{
        const {name,value} = e.target

        setMessage(prev =>{
               return{
                ...prev,
                text : value
               }
            }) 

  }

  const handleSendMessage = (e) =>{
             e.preventDefault()
            // console.log('iNSIDE bUTTON')
            // console.log('message',message)
            if(message.text || message.imageUrl || message.videoUrl){
                       if(socketConnection){
                           socketConnection.emit('new message',{
                               sender : user?._id,
                               receiver : params.userId,
                               text : message.text,
                               imageUrl : message.imageUrl,
                               videoUrl : message.videoUrl,
                               msgByUserId : user?._id
                           })
                          
                           setMessage({
                                text :"",
                                imageUrl :'',
                                videoUrl :''
                          })

                       }
            }  
  }


   const handleImageClick = (imageUrl)=>{
             setCurrentImageUrl(imageUrl);
             setImageViewOpen(true);
   }

   const handleCloseImageView = ()=>{
            setCurrentImageUrl('');
            setImageViewOpen(false);
   }




  useEffect(()=>{
      if(socketConnection && params.userId){
        socketConnection.emit('message-page',params.userId)

        socketConnection.emit('seen',params.userId)

        socketConnection.on('message-user',(data)=>{  
          setDataUser(data)
              
        })

        socketConnection.on('message',(data)=> {
              // console.log('message data',data)
            // i want to reflect this data into chat 
                setAllMessages(data)
                     
        })

      }
  },[socketConnection,params.userId,user])





  return (
    <div style={{backgroundImage : `url(${backgroundImage})`}} className='bg-no-repeat bg-cover'>
        <header className='flex items-center justify-between sticky top-0 h-[57px] border-l  bg-white'>
              <div className='flex items-center gap-2'>
                   <div className='flex  items-center p-1 px-3'>
                      <Avatar
                        width={50}
                        height={50}
                        imageUrl={dataUser?.profile_pic}
                        name={dataUser?.name}
                        userId={dataUser?._id}
                      />
                   </div>

                   <div className='flex flex-col  justify-center'>
                       <h3 className='font-semibold text-lg '>{dataUser?.name}</h3>
                       <p className='text-sm -mt-1'>
                        {
                          dataUser.online ? <span className='text-[#185469]'>Online</span> : <span className='text-[#b0afc9]'>Offline</span>
                        }
                       </p>
                   </div>
              </div>
              <div className='mr-3 p-2 rounded-lg hover:bg-slate-200'>
                 <button className=' cursor-pointer'>
                     <HiDotsVertical
                      size={20}
                    />
                 </button>
              </div>
        </header>

        {/* show all message  */}

        <section className="relative h-[calc(100vh-128px)] overflow-x-hidden overflow-y-auto scrollbar  bg-slate-200 bg-opacity-30">
          

                 {/* all message show here   */}
                 <div className='flex flex-col gap-1 mx-2  ' ref={currentMessage}>
                    { 
                       allMessages.map((msg,index)=>{
                          return(
                              <div className={` p-1 mb-2 max-w-[50%]  rounded-md w-fit ${user._id === msg.msgByUserId ? "ml-auto bg-slate-600  text-white  " : "bg-white" }`}>
                                    <div className='max-h-64 overflow-hidden'>
                                      {
                                      msg?.imageUrl && (
                                            <img
                                                src={msg?.imageUrl}
                                                className='w-auto max-w-full max-h-64 object-contain mx-auto cursor-pointer'
                                                onClick={() => handleImageClick(msg?.imageUrl)}     
                                                
                                            />
                                       )
                                      }
                                    </div>

                                    <div className='max-h-64 overflow-hidden'>
                                      {
                                      msg?.videoUrl && (
                                           <video
                                            src={msg?.videoUrl}
                                            className='w-auto max-w-full max-h-64 object-contain mx-auto'
                                            controls
                                           />
                                       )
                                      }
                                    </div>
                                    {msg?.text && <p className='px-2 pr-3 overflow-x-hidden h-auto'>{msg.text}</p>}
                                    <p className='text-xs ml-auto  w-fit mb-1 leading-0.5 '>{moment(msg.createdAt).format('hh:mm')}</p>

                                    
                              </div>
                          )
                       })
                    }
                 </div>

                 {/* upload display image */}
                {
                    message.imageUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:bg-red-500' onClick={handleClearUploadImage}>
                            <IoClose size={30}/>
                        </div>
                        <div className='bg-white p-3'>
                            <img
                              src={message.imageUrl}
                              alt='uploadImage'
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                            />
                        </div>
                      </div>
                    )
                  }

                  {/**upload video display */}
                  {
                    message.videoUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:bg-red-500' onClick={handleClearUploadVideo}>
                            <IoClose size={30}/>
                        </div>
                        <div className='bg-white p-3'>
                            <video 
                              src={message.videoUrl} 
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                              controls
                              muted
                              autoPlay
                            />
                        </div>
                      </div>
                    )
                  }

                  {
                    loading && (
                      <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
                        <Spinner/>
                      </div>
                    )
                  }
        </section>


        {/* send message  */}

        <section className='h-16 bg-white flex items-center px-4 border-l'>
            <div className='relative '>
               <button onClick={handlerImageVideoUpload} className='flex justify-center items-center w-11 h-11 rounded-full  hover:bg-slate-200 '>
                  <FaPlus
                    size={20}
                  /> 
               </button>

               {/* pop of video and image  */}

               {
                 openImageVideoUpload && (
                        <div className='bg-white shadow rounded-md absolute bottom-14 w-36 p-2 '>
                            <form>
                                <label htmlFor='uploadImage' className=' rounded-md flex items-center p-2 px-3 gap-3 hover:bg-slate-200'>
                                  <div onClick={() => {
                                      console.log("Div clicked");
                                      setOpenImageVideoUpload(false)
                                    }}>
                                      <FaImage size={18}/>
                                  </div>
                                  <p>Image</p>
                                </label>

                                <label htmlFor='uploadVideo' className=' rounded-md flex items-center p-2 px-3 gap-3 hover:bg-slate-200'>
                                  <div onClick={()=>{setOpenImageVideoUpload(false)}} >
                                      <FaVideo size={18}/>
                                  </div>
                                  <p>Video</p>  
                                </label>

                                <input
                                  type='file'
                                  id='uploadImage'
                                  onChange={handleUploadImage}
                                  className='hidden'
                                />

                                <input
                                  type='file'
                                  id='uploadVideo'
                                  onChange={handleUploadVideo}
                                  className='hidden'
                                />
                            </form>
                      </div>
                 )
               }



               

            </div>

            {/* input text  */}

            <form className='w-full h-full flex gap-2' onSubmit={handleSendMessage}>
                <input
                   type='text'
                   value={message.text}
                   placeholder='Type Your Message...'
                   className='py-1 px-4 outline-none w-full h-full'
                   onChange={handlerOnChange} 
                />

                <button className='hover:bg-slate-200 p-2 my-2 rounded-lg' >
                    <LuSend size={25}/>
                </button>

            </form>

        </section>

        {
            imageViewOpen && (
                  <ImageViewer
                    imageUrl={currentImageUrl} 
                    onClose={handleCloseImageView} 
                  />
            )
        }

    </div>
  )
}
