import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL;

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT_URL}auth?error=GoogleAuthFailed`
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

      res.redirect(`${CLIENT_URL}home?token=${token}`);

    } catch (error) {

      console.error("Google Auth Token Generation Error:", error);

      res.redirect(`${CLIENT_URL}auth?error=TokenGenerationFailed`);

    }
  }
);

export default router;