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
  contacts: string[];
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}


export interface Message{
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  roomId: string;
  replyTo: Message | null;
  timestamp: Date;
}
