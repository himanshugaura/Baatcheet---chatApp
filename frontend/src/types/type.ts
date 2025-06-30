export interface User {
  _id: string;
  name: string;
  bio: string;
  userName: string;
  email: string;
  password: string;
  googleId: string;
  profileImage: {
    url: string;
    publicId: string;
  };
  groups: string;
  followers: string[];
  following: string[];
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

