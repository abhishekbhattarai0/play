import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscriptions.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    //subscriber channel
    const subscriberId = req.user?._id

    if( !channelId && subscriberId) {
        throw new ApiError(400, "Both channel id and subscriber id required")
    }

    const isSubscribed = await Subscription.findOne({subscriber:subscriberId})

    if(!isSubscribed){
        const subscription = await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        })

        return res
        .status(200)
        .json( new ApiResponse(200, subscription, "Channel Subscribed"))
    }else{
        const subscription = await Subscription.findOneAndDelete({subscriber: subscriberId})
        return res
        .status(200)
        .json( new ApiResponse(200, subscription, "Channel unsubscribed"))
    }

    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    console.log(req.params)
    if(!subscriberId){
        throw new ApiError(400, "Suscriber id required")
    }

    const subscription = await Subscription.find({subscriber:subscriberId})
    
    return res
    .status(200)
    .json( new ApiResponse(200, subscription, "All subscribed channels are fetched"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
}