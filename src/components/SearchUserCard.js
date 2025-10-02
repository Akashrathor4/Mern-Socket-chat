import React from 'react'
import { Avatar } from './Avatar'
import { Link } from 'react-router-dom'

export const SearchUserCard = ({user , onClose}) => {
  return (
    <Link to={'/' + user._id} onClick={onClose} className='flex items-center gap-3 p-2  hover:bg-slate-100 rounded-md cursor-pointer'>
        <div>
               <Avatar
                  width={50}
                  height={50}
                  name={user?.name}
                  imageUrl={user?.profile_pic}
                  userId = {user._id }
               />
        </div>
        <div>
            <div className='font-semibold'>
                {user?.name}
            </div>
        </div>
    </Link>
  )
}
