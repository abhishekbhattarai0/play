import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    // video content owner
    const owner = req.user?._id
    const { content, videoId } = req.body

    if( !content && !videoId && !owner){
        throw new ApiError(400, "All fields are requird")
    }

    const comment = await Comment.create({
        content,
        owner,
        videoId
    })

    if(!comment){
        throw new ApiError(400, "Comment doesnot exist or something went wrong while deleting")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, comment, "Commented successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }