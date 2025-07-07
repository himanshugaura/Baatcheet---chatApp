import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const existingUser = await UserModel.findOne({ googleId: profile.id });
        if (existingUser) return done(null, existingUser);

        const email = profile.emails?.[0].value || "";

        const userByEmail = await UserModel.findOne({ email });
        if (userByEmail) {
          return done(
            new Error(
              "An account with this email already exists. Try logging in instead."
            )
          );
        }
        
        const baseName = profile.displayName.replace(/\s+/g, "").toLowerCase();
        let uniqueUserName = "";
        let isUnique = false;

        while (!isUnique) {
          const randomSuffix = Math.floor(Math.random() * 10000);
          const candidate = `${baseName}${randomSuffix}`;
          const existing = await UserModel.findOne({ userName: candidate });
          if (!existing) {
            uniqueUserName = candidate;
            isUnique = true;
          }
        }

        const newUser = await UserModel.create({
          googleId: profile.id,
          email,
          name: profile.displayName,
          userName: uniqueUserName,
          profileImage: {
            url: profile.photos?.[0].value,
          },
        });

        done(null, newUser);
      } catch (err: any) {
        if (err.code === 11000 && err.keyPattern?.email) {
          return done(
            new Error(
              "An account with this email already exists. Try logging in instead."
            )
          );
        }
        done(err);
      }
    }
  )
);
