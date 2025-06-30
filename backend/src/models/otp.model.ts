import mongoose, { Schema, model } from 'mongoose';
import { IOTP } from '../types/type';

const OTPSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OTPModel = mongoose.models.OTP || model<IOTP>('OTP', OTPSchema);
export default OTPModel;
