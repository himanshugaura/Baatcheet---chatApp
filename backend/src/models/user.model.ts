  import mongoose, { Schema, model } from 'mongoose';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';
  import dotenv from 'dotenv';
  import { IUser } from '../types/type.js';

  dotenv.config();
  const JWT_SECRET = process.env.JWT_SECRET as string;

  // Define the user schema
  const UserSchema = new Schema<IUser>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30,
      },
      bio: 
      {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
      userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 15,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
      },
      googleId: { 
        type: String, 
        sparse: true, 
        unique: true 
      },
      password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    trim: true,
    minlength: 8,
  },
    profileImage: {
      url:{
        type : String,
      } ,
      publicId : {
        type : String,
    }
    },
      groups: [
        {
          type: Schema.Types.ObjectId,
          ref: "Group",
        },
      ],
      followers: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      following: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      lastSeen: {
        type: Date,
        default: Date.now(),
      },
    },
    { timestamps: true }
  );

  // Pre-save hook to hash the password
  UserSchema.pre("save", async function (next) {
    // Only hash the password if it is present and modified
    if (!this.isModified("password") || !this.password) {
      return next();
    }

    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err as Error);
    }
  });

  // Method to compare passwords
  UserSchema.methods.comparePassword = async function (candidatePassword : string) {
    if (!this.password) {
      throw new Error("Password not set on user document.");
    }
    return bcrypt.compare(candidatePassword, this.password);
  };


  // Method to generate JWT
  UserSchema.methods.generateJWT = function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        userName: this.userName,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  };

  // Create and export the user model
  const UserModel = mongoose.models.User || model('User', UserSchema);
  export default UserModel;
