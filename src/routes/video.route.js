import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.use(verifyJWT)
router.route("/").get(getAllVideos).post(
    upload.fields([
        {
            name:"video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount:1
        }
    ]),
    publishAVideo
)

router.route("/:videoId").get(getVideoById)
router.route("/:videoId").patch(upload.single("thumbnail"),updateVideo).delete(deleteVideo)
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router
