import mongoose, { Schema, model } from 'mongoose';
import { IMessage } from '../types/type';

const messageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  roomId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const MessageModel = mongoose.models.Message || model<IMessage>('Message', messageSchema);
export default MessageModel;
