const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`

export const uploadFile = async(file)=>{
    const formData = new FormData()
    formData.append('file',file)
    formData.append("upload_preset","chat-app")


    const response = fetch(url,{
        method : 'POST' ,
        body : formData
    })
    const responseData = (await response).json()
    console.log("responseData",responseData)

    return responseData;
}