import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/users.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Added the slash here to guarantee a clean URL string
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
      // THIS IS MANDATORY FOR DEPLOYING ON RENDER
      proxy: true 
    },
    
    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails[0].value;

        let user = await User.findOne({ email });
        
        if (!user) {
          // --- THE FIX: Generate a unique username from the email ---
          const baseUsername = email.split('@')[0]; // Gets "msdhoni21998"
          const randomNum = Math.floor(1000 + Math.random() * 9000); // Adds 4 random digits
          const generatedUsername = `${baseUsername}${randomNum}`;

          user = await User.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            username: generatedUsername // <-- Now MongoDB gets a unique string!
          });
        }

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;