import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, updateComment } from "../controllers/comment.controller.js";



const router = Router()

router.route("/").post(verifyJWT, addComment)
router.route("/:commentId").delete(verifyJWT, deleteComment).patch(verifyJWT, updateComment)

export default router