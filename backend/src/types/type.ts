import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  userName: string;
  bio: string;
  email: string;
  password: string;
  googleId: string;
  profileImage: {
    url : string ,
    publicId : string
  }
  groups: Types.ObjectId[];
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  generateJWT(): string;
}

export interface IUserLean {
  _id: Types.ObjectId;
  following: Types.ObjectId[];
}


export interface DecodedUser {
  _id: string;
  email: string;
  name: string;
  userName: string;
  profileImage: {
    url: string;
    publicId: string;
  };
}

export interface IGroup extends Document {
  name: string;
  users: Types.ObjectId[];
  admins: Types.ObjectId[];
  owner: Types.ObjectId;
  type: 'PUBLIC' | 'PRIVATE';
  createdAt: Date;
  updatedAt: Date;
}

export interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  roomId: string;
  replyTo: Types.ObjectId;
  timestamp: Date;
}
