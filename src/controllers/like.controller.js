import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user?._id
    const {like} = req.body
    // TODO: toggle like on video
    if( !userId && videoId) {
        throw new ApiError(400, "video id and user id are required")
    }
    if (!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id")
    }

    if( !isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User id")
    }

    if(like){
        const likeVideo = await Like.create({
            video: Object(videoId),
            likedBy: userId
        })
        return res.json( new ApiResponse(200, likeVideo, "You liked a video"))
    }else{
        const unlikeVideo = await Like.findByIdAndDelete(videoId)
        return res.json( new ApiResponse(200, unlikeVideo, "You liked a video"))
    }


})



const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}