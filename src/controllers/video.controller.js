import { Video } from "../models/video.model.js";
import {User} from '../models/user.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})


const publishAVideo = asyncHandler( async(req, res) => {
    const { title, description } = req.body
    const videoLocalPath =  req?.files?.video[0].path
    const thumbnailLocalPath = req?.files?.thumbnail[0].path

    if(!(videoLocalPath && thumbnailLocalPath)) {
        throw new ApiError(400, " Both thumbnail and video field should not be empty")
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if( !video) {
        throw new ApiError(400, " Video file is required")
    }

    if( !thumbnail) {
        throw new ApiError(400, " thumbnail file is required")
    }

    const uploadedVideo = await Video.create({
        videoFile: video?.url,
        thumbnail: thumbnail?.url,
        duration: video.duration,
        title,
        description,
        owner: req.user?._id
    })

    if(!uploadedVideo) {
        throw new ApiError(400, "Something went wrong while uploading a video")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, uploadedVideo, "Video uploaded successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    console.log( " Video id", videoId)
    
    if( !videoId ){
        throw new ApiError(400, "Video Id is required")
    }

    const video = await Video.findOne({ _id: videoId});
    console.log(video)

if( !video ) {
    throw new ApiError(400, "Can't find video")
}

    return res
    .status(200)
    .json( new ApiResponse( 200, video, "video fetched successfull"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    console.log( " REQ ====>", req)
    console.log(req.body)
    //TODO: update video details like title, description, thumbnail
    console.log( " Req Body",req.body, req.params)
    const { title, description, thumbnail} = req.body
    
    if( !(title || description || thumbnail)) {
        throw new ApiError(400, " Need to edit atleast one field")
    }

    if( thumbnail){
        thumbnailLocalPath = req.body?.thumbnail[0].path
       thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
       
    }
    console.log("\n\n1\n\n")
    const oldVideo = await Video.findById(videoId)
    const oldThumbnail = oldVideo.thumbnail
    if(oldThumbnail){
        await deleteFromCloudinary(oldThumbnail)
    }
    console.log("\n\n1\n\n")
    console.log(oldThumbnail)

    const video = await Video.findOneAndUpdate( 
        { _id: videoId},
        {
            title,
            description,
            thumbnail
        },
        { new: true}
    )

    return res
    .status(200)
    .json( new ApiResponse( 200, video, "Video updated"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId) {
        throw new ApiError(400, "Require video id")
    }

    const video = await Video.findByIdAndDelete(videoId)
    console.log("video", video)

    if(!video){
        throw new ApiError(400, "Video doesnot exist")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, video, "Video has been deleted successfully"))
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { isPublished } = req.body

    if(!videoId) {
        throw new ApiError(400, "Require video id to unpublish")
    }


    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            isPublished
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json( new ApiResponse(200, video, "Publish toggled"))
})

export {
    publishAVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
    
}