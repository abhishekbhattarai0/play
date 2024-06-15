import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description, videos} = req.body
    const userId = req.user?._id
    //TODO: create playlist : name description video owner
    console.log(name, description, videos)

    let video = videos.filter( (item,
        index) => videos.indexOf(item) === index)

    if( !name && ! description && !videos) {
        throw new ApiError(400, " Requires name , description and video")
    }

    if( isValidObjectId(!userId)){
        throw new ApiError( 400, "Invalid User ID")
    }
    
   const playlist = await Playlist.create({
        name,
        description,
        videos:video,
        owner: userId
    })

    return res
    .status(200)
    .json( new ApiResponse(200, playlist, "Something went wrong while creating playlist"))

    
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    console.log(userId)
    //TODO: get user playlists
    if(!userId){
        throw new ApiError(400, "User id required")
    }

    const playlists = await Playlist.find({owner:userId}).populate('videos', '-populate')

    return res
    .status(200)
    .json( new ApiResponse(200, playlists, "Playlist fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    let {playlistId} = req.params
    console.log(req.params, "req params")
    //TODO: get playlist by id
    if(!playlistId) {
        throw new ApiError(400, "Playlist Id required")
    }
    const playlist = await Playlist.findById(playlistId).populate('videos', '-playlist'); // Exclude playlist reference
    
    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if( !playlistId && !videoId){
        throw new ApiError(400, "Both playlist id and video id is required")
    }

    // const oldPlaylist = await Playlist.findById(playlistId)
    // oldPlaylist.videos.push(videoId)
    // const videos = oldPlaylist.videos


    const update = { $push: { videos: videoId } };


    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        update,
        { new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if( !playlistId && !videoId){
        throw new ApiError(400, "Both playlist id and video id is required")
    }

    // const oldPlaylist = await Playlist.findById(playlistId)
    // oldPlaylist.videos.pop(videoId)
    // const videos = oldPlaylist.videos

    const update = { $pull: { videos: videoId } };


    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        update,
        { new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId){
        throw new ApiError(400, "Requires playlist id")
    }
    const playlist = await Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!playlistId){
        throw new ApiError(400, "Requires playlist id")
    }

    if(!name || !description){
        throw new ApiError(400, "Atleast on field should not be empty")
    }
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name,
            description
        },
        { new : true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist deleted"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}