import { Router } from "express";
import {
	changeCurrentUserPassword,
	getCurrentUser,
	getUserChannelProfile,
	getWatchHistory,
	loginUser,
	logoutUser,
	refreshAccessToken,
	registerUser,
	test,
	updateAccountDetails,
	updateUserAvatar,
	updateUserCoverImage
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


/**
* @swagger
*  openapi: 3.0.0
* info:
* title: User Registration API
*     version: 1.0.0
* servers:
*     - url: /api
* components:
*     securitySchemes:
*         ApiKeyAuth:
*             type: apiKey
*             in: header
*             name: x-api-key
*         bearerAuth:
*             type: http
*             scheme: bearer
*             bearerFormat: JWT
*     schemas:
*         UserRegistration:
*             type: object
*             required:
*                 - username
*                 - email
*                 - fullname
*                 - password
*                 - avatar
*             properties:
*                 username:
*                     type: string
*                 email:
*                     type: string
*                     format: email
*                 fullname:
*                     type: string
*                 password:
*                     type: string
*                     format: password
*                 avatar:
*                     type: string
*                     format: binary
*                 coverImage:
*                     type: string
*                     format: binary
*         UserResponse:
*             type: object
*             properties:
*                 _id:
*                     type: string
*                 username:
*                     type: string
*                 email:
*                     type: string
*                 fullname:
*                     type: string
*                 avatar:
*                     type: string
*                     format: uri
*                 coverImage:
*                     type: string
*                     format: uri
* paths:
*     /register:
*         post:
*             tags:
*                 - register
*             summary: Register a new user
*             security:
*                 - ApiKeyAuth: []
*                 - bearerAuth: []
*             requestBody:
*                 required: true
*                 content:
*                     multipart/form-data:
*                         schema:
*                             $ref: '#/components/schemas/UserRegistration'
*             responses:
*                 '201':
*                     description: User registered successfully
*                     content:
*                         application/json:
*                             schema:
*                                 $ref: '#/components/schemas/UserResponse'
*                 '400':
*                     description: Bad Request
*                 '409':
*                     description: Conflict - User already exists
*                 '500':
*                     description: Internal Server Error
*/

router.route("/register").post(
	upload.fields([
		{
			name: "avatar",
			maxCount: 1
		},
		{
			name: "coverImage",
			maxCount: 1
		}
	]),
	registerUser
)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with username or email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/LoginWithUsername'
 *               - $ref: '#/components/schemas/LoginWithEmail'
 *           examples:
 *             LoginWithUsername:
 *               summary: Login using username
 *               value:
 *                 username: johndoe
 *                 password: strongpassword123
 *             LoginWithEmail:
 *               summary: Login using email
 *               value:
 *                 email: johndoe@example.com
 *                 password: strongpassword123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Missing username or email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/login").post(loginUser)

//secured routes
router.route("/test").get(test)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)


// when we are taking data from req.params we need to use colon(:) with variable name
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watch-history").get(verifyJWT, getWatchHistory)

export default router