import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { Spinner } from './Spinner';
import {SearchUserCard} from './SearchUserCard'
import toast from 'react-hot-toast'
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";

export const SearchUser = ({onClose}) => {

  const [searchUser,setSearchUser] = useState([])
  const [loading,setLoading] = useState(false)
  const [search,setSearch] = useState("")
 
  
  const handleSearchUser = async() =>{ 
                  const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user` 
                 setLoading(true)
                 try {
                      
                       const response = await axios.post(URL,{
                        search : search,
                       })  
                       setLoading(false)
                       setSearchUser(response.data.data)

                       

                 } catch (error) {
                     toast.error(error?.response?.data?.message)
                 }
  }

  useEffect(()=>{
     handleSearchUser()
  },[search])
    
  console.log("searchUser",searchUser)

  return (
    <div className=' fixed top-0 bottom-0 right-0 left-0 z-40 bg-slate-700 bg-opacity-40 p-2'>
      <div className='    w-full max-w-lg mx-auto mt-10  '>
           {/* input search user  */}
          <div className='bg-white rounded-md h-12 overflow-hidden flex '>
               <input
                type='text'
                placeholder='Search User By Name And Email...'
                className='w-full outline-none py-1 h-full px-4'
                onChange={(e)=>setSearch(e.target.value)}
                value={search}
               />
               <div className='h-15 w-15 flex justify-center items-center mr-5 text-slate-400'>
                  <FaSearch
                    size={20}
                  />
               </div>

          </div> 

          {/* display search user  */}
          <div className='bg-white  mt-2 w-full overflow-auto p-4 rounded'>
               {/* no user found  */}

                {
                  searchUser.length === 0 && !loading && (
                    <p className='text-center text-slate-500'>No User Found</p>   
                  )
                }

                {
                    loading && (
                      <Spinner/>
                    )
                }

                {
                  searchUser.length !== 0 && !loading &&(
                       searchUser.map((user,index)=>{
                              return(
                                   <SearchUserCard onClose={onClose} key={user._id} user={user} />
                              )
                       })
                  )
                }
          </div>
      </div>
        <div >
           <button onClick={onClose} className='absolute top-0 right-0 text-2xl p-3  hover:bg-red-500 hover:text-white'>
                 <RxCross2 size={20 }/>
           </button>
        </div>
    </div>
  )
}

