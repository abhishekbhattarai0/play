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
    const userId = req.user?._id
    const tweet = await Tweet.find({owner: userId})

    if( !tweet) {
        throw new ApiError(404, "Tweets not found")
    }

    res.json( new ApiResponse(200, tweet, "Tweets retrieved successfully"))
    
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {newContent} = req.body
    const {tweetid} = req.params

    console.log(" content", req.body, req.body.newcontent)
    if(!newContent){
        throw new ApiError(400, "Content field is empty")
    }

    const tweet = await Tweet.findOneAndUpdate(
        { _id:tweetid},
        {
            content: newContent,
        },
        {
            new: true
        }
    )

    if(!tweet) {
        throw new ApiError(404, "tweet not found")
    }
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
