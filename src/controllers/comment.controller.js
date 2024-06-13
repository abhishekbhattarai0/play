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
    const { commentId } = req.params
    const { content } = req.body

    if( !commentId && !content){
        throw new ApiError(400, "comment Id and content are required")
    }

    const updatedComment = await Comment.findByIdAndUpdate( commentId, { content}, { new : true})

    if( !updatedComment){
        throw new ApiError(400, "Something went wrong while deleting comment")
    }
    console.log(updateComment)

    return res 
    .status(200)
    .json(new ApiResponse(200, updateComment, " Comment updated"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId} = req.params
    console.log("Params", req.params)
    
    if(!commentId){
        throw new ApiError(400, "Comment Id required to delete")
    }

    const comment = await Comment.findByIdAndDelete(commentId)

    if( !comment) {
        throw new ApiError(400, "Something went wrong while deleting comment")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, "comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }