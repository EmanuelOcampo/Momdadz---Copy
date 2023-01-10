import express from "express";
const router =  express.Router()

import {landing, register, login, updateUser } from "../controllers/authController.js";
import {auth, isAdmin} from "../middleware/auth.js";

router.route("/register").post(register)
router.route("/login").post(login)

router.route("/landing",isAdmin).post(landing)
router.route("/updateUser").patch(auth, updateUser)


export default router

