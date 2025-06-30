
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK!,
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
     const existingUser = await UserModel.findOne({ googleId: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    const email = profile.emails?.[0].value || "";
    const newUser = await UserModel.create({
      googleId: profile.id,
      email,
      name: profile.displayName,
      userName: profile.displayName,
      profileImage: {
        url: profile.photos?.[0].value,
      }
    });

    done(null, newUser);
  } catch (err) {
    done(err as Error);
  }
}));

