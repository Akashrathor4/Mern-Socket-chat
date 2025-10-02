import React, { useRef } from 'react'
import { IoClose } from 'react-icons/io5';

export const ImageViewer = ({imageUrl,onClose}) => {
 
  const modalRef = useRef()

  const handleOverlayClick = (e)=>{
           // Close if clicked directly on the overlay, not on the image itself
           if(modalRef.current && e.target == modalRef.current){
            onClose();
           }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90'
    onClick={handleOverlayClick}
    ref={modalRef}
    >
 
         <button
          className='absolute top-4 right-4 text-white text-3xl z-50 p-2 rounded-full hover:bg-gray-700'
          onClick={onClose}
          aria-label="Close image viewer"
         >
              <IoClose/>     
         </button>
         <div  className='relative max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
            <img 
                src={imageUrl} 
                alt="Expanded chat media" 
                className="max-w-full max-h-full object-contain" 
            />
         </div>

    </div>
  )
}
