import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    // video comment tweet likedBy 
    const {videoId} = req.params
    const userId = req.user?._id
   
    // TODO: toggle like on video
    if( !userId && !videoId) {
        throw new ApiError(400, "video id and user id are required")
    }
    if (!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id")
    }

    if( !isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User id")
    }

    const existedLike = await Like.findOne({video:videoId})

    if(existedLike){
        const unlikeVideo = await Like.findOneAndDelete(videoId)
        return res.json( new ApiResponse(200, unlikeVideo, "You unliked a video"))
       
        
    }else{
        const likeVideo = await Like.create({
            video: Object(videoId),
            likedBy: userId
        })
        return res.json( new ApiResponse(200, likeVideo, "You liked a video"))
    }


})



const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user?._id
    console.log(" user ID \n\n\n",userId)

    if( !commentId && !userId){
        throw new ApiError(400, "Require comment id and user id")
    }

    if (!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid video Id")
    }

    if( !isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User id")
    }

    const existedLike = await Like.findOne({comment: commentId})

    if( existedLike) {
        const like = await Like.findOneAndDelete(commentId);

        return res
        .status(200)
        .json( new ApiResponse(200, like, " Comment unliked"))
    }else{
        const like = await Like.create({
            comment: commentId,
            likedBy: userId
        })

        return res
        .status(200)
        .json( new ApiResponse(200, like, "Comment Liked"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user?._id

    if( !tweetId && !userId){
        throw new ApiError(400, "Require tweetId and user id")
    }

    if (!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweetId")
    }

    if( !isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User id")
    }

    const existedLike = await Like.findOne({tweet: tweetId})

    if(existedLike){
        const like = await Like.findOneAndDelete(tweetId)
        return res
        .status(200)
        .json( new ApiResponse(200, like, "Tweet unlike"))
    }else{
        const like = await Like.create({
            likedBy: userId,
            tweet: tweetId
        })

        return res
        .status(200)
        .json( new ApiResponse(200, like, "Tweet liked"))
    }
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