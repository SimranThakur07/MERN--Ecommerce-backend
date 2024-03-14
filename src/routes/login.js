import express from "express";
import { userLogin } from "../controllers/login.js";


const app = express.Router()
// route -- /api/v1/login/auth
app.post("/auth", userLogin)


export default app 