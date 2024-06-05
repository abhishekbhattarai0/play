import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

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
   console.log("email ", email)

   if (
      [username, email, fullname, password].some((field) => field?.trim() === "")
   ) {
      throw new ApiError("400", "All fields are required")
   }
   // you can write many validation if you like like email validation. In production seperate validation file is made with seperate validation method which is imported here to call

   const existedUser = User.findOne({
      $or: [{ username }, { email }]
   })

   if (existedUser) {
      throw new ApiError(409, "User with email or username alredy exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is Required")
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

export { registerUser }