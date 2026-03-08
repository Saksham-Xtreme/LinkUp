import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  // Added failureRedirect so if Google auth fails, it safely sends them back to your login page
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/auth?error=GoogleAuthFailed" }),
  (req, res) => {
    try {
      const token = jwt.sign(
        {
          id: req.user._id,
          email: req.user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Redirect back to your React frontend, passing the token in the URL
      res.redirect(`http://localhost:5173/home?token=${token}`);

    } catch (error) {
      console.error("Google Auth Token Generation Error:", error);
      res.redirect("http://localhost:5173/auth?error=TokenGenerationFailed");
    }
  }
);

export default router;