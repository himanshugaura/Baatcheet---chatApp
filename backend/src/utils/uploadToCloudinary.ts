import { v2 as cloudinary } from "cloudinary";
import "../config/cloudinary.js";
import { PassThrough } from "stream";

/**
 * Upload a Buffer to Cloudinary (for multer.memoryStorage).
 * @param buffer File buffer (req.file.buffer)
 * @param folder Optional folder name
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder?: string
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    const stream = new PassThrough();
    stream.end(buffer);
    stream.pipe(uploadStream);
  });
}
