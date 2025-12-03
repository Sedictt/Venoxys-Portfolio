
// Cloudinary Configuration
// Replace these with your actual Cloudinary details
const CLOUD_NAME = 'dmgjkbgjr'; // Replace with your cloud name
const UPLOAD_PRESET = 'Portfolio'; // Replace with your unsigned upload preset

import imageCompression from 'browser-image-compression';

export const uploadImage = async (file: File): Promise<string> => {
    // Compression options
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};
