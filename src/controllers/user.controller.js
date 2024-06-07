import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async(userId) => {
   try {
      const user = await User.findById(userId)

      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({validateBeforeSave: false})

      return {accessToken, refreshToken}
   } catch (error) {
      throw new ApiError(501, "Something went wrong while generating refresh and access token")
   }
}

const registerUser = asyncHandler(async (req, res) => {
   /**
    *           TO REGISTER USER :-
    * 1. get user details from frontend (what details will be needed depends upon the user model)
    * 2. validation : whether user is send empty field or not , is details are in correct format or not
    * 3. check if user is alredy exists (can be checked using email or username or using both)
    * 4. check for images, check for avatar
    * 5. upload them to cloudinary, take the reference of files which are uploaded in cloudinary which you will get in return
    * 6. create user object because mongodb is a no sql db .then create entry in db. after that we will get all the details of user in response
    * 7. remove password and refresh token field from response
    * 8. check for user creation
    * 9. if created return response else return error
    */
   
   const { username, email, fullname, password } = req.body;
   console.log("req.body", req.body)
   

   if (
      [username, email, fullname, password].some((field) => field?.trim() === "")
   ) {
      throw new ApiError("400", "All fields are required")
   }
   // you can write many validation if you like like email validation. In production seperate validation file is made with seperate validation method which is imported here to call

   const existedUser = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (existedUser) {
      throw new ApiError(409, "User with email or username alredy exists")
   }


   const avatarLocalPath = req.files?.avatar[0]?.path;
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is Required")
   }

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0 ){
      coverImageLocalPath = req.files.coverImage[0].path
   }


   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
      throw new ApiError(400, "Avatar file is required")
   }

   
   const user = await User.create({
      username: username.toLowerCase(), 
      email, 
      fullname,
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || ""
   })

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if(!createdUser){
      throw new ApiError(500, "Something went wrong while registering new user")
   }

   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered successfully")
   )

})


const loginUser = asyncHandler(async (req, res) => {
   /**
    * TODO for login
    * req.body -> data
    * username or email
    * find the user
    * password check
    * generate access and refresh token 
    * send cookie
    * send response as successful login
    */


   console.log(" Req : ", req)
   const {email, username, password } = req.body;
   console.log("email: ", req.body);


   if( !(username || email)) {
      throw new ApiError(400, "username or email is requird")
   }
 
   // Alternative 
   // if(!username && !email){
   //    throw new ApiError(400, "username or email is required")
   // }

   const user = await User.findOne({
      $or: [{username}, {email}]
   })

   if (!user) {
      throw new ApiError(404, "User not found")
   }

   const validUser = await user.isPasswordCorrect(password);

   if (!validUser){
      throw new ApiError(401, "Invalid user credentials")
   }

   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken") // this may be expensive operation

   const options = {
      httpOnly: true,
      secure: true // by default cookie can be modified when we use httpOnly and secure true now only server modifiable
   }

   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken",refreshToken, options)
   .json(
      new ApiResponse(
         200,
         {
         user: loggedInUser, accessToken, refreshToken
         },
         "User Logged n Successfully"
      )
   )

   

})

const logoutUser = asyncHandler( async(req, res) => {
   User.findByIdAndUpdate(
      req.user._id,
      {
         $set: {
            refreshToken: undefined,
         }
      },
      {
         new: true
      }
   )

   const options = {
      httpOnly: true,
      secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler( async(req, res) => {
   try {
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
   
      if (!incomingRefreshToken) {
         throw new ApiError(401, "Unauthorized request")
      }
   
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
   
      const user = await User.findById(decodedToken?._id)
   
      if( ! user){
         throw new ApiError(401, "Invalid refresh token")
      }
   
      if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401, "Refresh token is expired or used")
      }
   
      const options = {
         httpOnly: true,
         secure: true
      }
   
      const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
   
      return res
      .status(200)
      .cookie("accessToken",accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
         new ApiResponse(
            200,
            {accessToken, refreshToken: newRefreshToken},
            "Access Token refreshed successfully"
         )
      )
   } catch (error) {
      throw new ApiError(401, error?.message||"Invalid refresh token")
   }



})

const changeCurrentUserPassword = asyncHandler( async(req, res) => {
   const {oldPassword, newPassword, confPassword} = req.body;

   if( oldPassword !== newPassword){
      throw new ApiError(401, "new password and confirm password doesnot matched")
   }

   const user = await User.findById(req.user?.id) 
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect){
      throw new ApiError(401, "Invalid password")
   }

   user.password = newPassword
   await user.save({validateBeforeSave: false})

   return res
   .status(200)
   .json( new ApiResponse(200, {}, "Password changed successfully"))
})


export { 
   registerUser , 
   loginUser , 
   logoutUser,
   refreshAccessToken
}