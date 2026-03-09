import { Router } from "express";
// Import the new history controllers we created
import { register, login, getHistory, addToHistory } from "../controllers/users.controller.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);

// Map the routes to match your Axios calls in AuthContext.js
router.route("/add_to_history").post(addToHistory);
router.route("/get_history").get(getHistory);

export default router;