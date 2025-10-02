import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import { Sidebar } from '../components/Sidebar'
import logo from "../assets/logo.png"
import { io } from "socket.io-client";

export const Home = () => {

  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const basePath = location.pathname ==='/'
// basePath become true
  console.log("redux user",user)

  // if token not present in user  then redirected to email

  const fetchUserDetails = async()=>{
       try {
           const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
           const response = await axios ({
                 url : URL,
                 withCredentials : true,      
           })

           dispatch(setUser(response.data.data))

          
           if(response.data.logout){
              dispatch(logout())
              navigate("/email")
           }
       } catch (error) {  
            console.error("error",error);
       }
  }

  //from here i want to send this whole details of user to every page 
  // for that i will use redux state management

  useEffect(()=>{
      fetchUserDetails()
  },[])
   
  // this is a standard way to establish the connection to socket.io only happened once and store that in redux 
  useEffect(()=>{
        // 1. Check if the user object has a valid _id (i.e., they are logged in)
        if (user?._id) { 
            console.log("Attempting socket connection for user:", user._id);

            // 2. Only connect if user is authenticated
            const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
                auth :{
                    // Ensure the token is always fetched *inside* this authenticated block
                    token : localStorage.getItem('token') 
                }
            } )

            socketConnection.on('onlineUser',(data)=> {
                console.log('onlineUser data: ', data)
                dispatch(setOnlineUser(data))
            }) 

            dispatch(setSocketConnection(socketConnection))

            // Cleanup function to disconnect when component unmounts OR user logs out
            return ()=>{
                socketConnection.disconnect()
            }
        }
    // Dependency array now includes the 'user' object
    },[user._id])

  return (
    <div className='grid grid-cols-[350px,1fr] h-screen max-h-screen'>
            {/* ${basePath && "hidden"}   */}
            <section className={`bg-white  `}>
              <Sidebar/>
            </section>
             {/* message component */}
            {/* <section className={`${basePath && "hidden"}`}>
              <Outlet/>
            </section> */}

            {!basePath && (
              <section>
                <Outlet/>
              </section>
            )}

           {
              basePath && (
                 <div className='flex justify-center items-center flex-col'>
                    <div>
                        <img
                          src={logo}
                          width={250}
                          alt='logo'
                        />
                    </div>
                    <p>
                        Select User To Send Message 
                    </p>
                </div>
              )
           }

    </div>
  )
}
