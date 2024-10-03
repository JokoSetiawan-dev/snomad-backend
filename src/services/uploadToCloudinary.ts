import cloudinary from 'cloudinary';

// Function to upload the image buffer to Cloudinary
export const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error); // Reject if there is an error
        } else {
          resolve(result?.secure_url || ''); // Resolve with the image URL
        }
      }
    );
    stream.end(fileBuffer); // Upload image buffer to Cloudinary
  });
};
