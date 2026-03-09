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
  passport.authenticate("google", {
    session: false,
    // Fix 1: Dynamically grab the variable and add the slash before "auth"
    failureRedirect: `${process.env.CLIENT_URL}/auth?error=GoogleAuthFailed`
  }),
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

      // Fix 2: Added the slash before "home"
      res.redirect(`${process.env.CLIENT_URL}/home?token=${token}`);

    } catch (error) {
      console.error("Google Auth Token Generation Error:", error);
      // Fix 3: Added the slash here as well
      res.redirect(`${process.env.CLIENT_URL}/auth?error=TokenGenerationFailed`);
    }
  }
);

export default router;