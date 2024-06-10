import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {

    /**
     * take a content to post as tweet
     * check whether content is on the request if not show error
     * if content is available the do the following
     *      take user id for owner field
     * save the tweet in db
     */

    console.log("inside the tweet controller")
    const {content }= req.body

    console.log(content)

    if(!content) {
        throw new ApiError(400, "Content field cannot be empty")
    }

    // const user = await User.findById(req.body._id)
    // if(!user){
    //    throw new ApiError(400, "user not found")
    // }

    // const owner = user._id;
    const owner= await req.user?._id



    const tweet = await Tweet.create({
        content,
        owner
    })

    return res.status(200)
    .json( new ApiResponse(200, tweet, "Tweeted Successfully"))


})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const content = req.body.content
    console.log(" content", req.body.content, req.body.newContent)
    if(!content){
        throw new ApiError(400, "Content field is empty")
    }
    const owner = req.user._id
    console.log("Owner ", req.user._id)

    const tweet = await Tweet.findOneAndUpdate(
        {owner},
        {
            content: content,
        },
        {
            new: true
        }
    )

    return res.json(
        new ApiResponse(200, tweet, "Tweet edited successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
