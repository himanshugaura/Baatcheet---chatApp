import { Area } from "react-easy-crop";

export default function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  originalFileName: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("No blob from canvas");
        const file = new File([blob], originalFileName, { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    };
    image.onerror = (err) => reject(err);
  });
}
