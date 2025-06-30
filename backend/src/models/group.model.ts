import { Schema, model } from 'mongoose';
import { IGroup } from '../types/type';

const GroupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 30,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IGroup>('Group', GroupSchema);
