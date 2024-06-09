import {v2 as cloudinary} from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const deleteFromCloudinary = async(filePath) => {
    try {
        console.log("File path from delete", filePath)
        const publicId = filePath.split("/")[7].split(".")[0]

        if(!publicId) return null;
        const response = await cloudinary.uploader.destroy(publicId, ()=>{
            console.log("DEleted successfully")
        })

        return response;
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting file")
    }

}

export {deleteFromCloudinary}
