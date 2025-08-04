import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  publicId?: string;
  tags?: string[];
  private?: boolean;
}

export interface UploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

/**
 * Upload a file to Cloudinary with private access by default
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const uploadOptions = {
      folder: options.folder || 'archivos-paranormales',
      resource_type: options.resourceType || 'auto' as any,
      public_id: options.publicId,
      tags: options.tags || ['paranormal', 'private'],
      // Set as private by default for security
      type: options.private !== false ? 'private' : 'upload',
      access_mode: options.private !== false ? 'authenticated' : 'public',
    };

    // Convert Buffer to base64 data URL if it's a Buffer
    const fileToUpload = Buffer.isBuffer(file) 
      ? `data:application/octet-stream;base64,${file.toString('base64')}`
      : file;

    const result = await cloudinary.uploader.upload(fileToUpload, uploadOptions);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

/**
 * Upload audio file specifically for paranormal stories
 */
export async function uploadAudioStory(
  audioBuffer: Buffer,
  storyId: string,
  userId: string
): Promise<UploadResult> {
  return uploadToCloudinary(audioBuffer, {
    folder: 'archivos-paranormales/audios',
    resourceType: 'video', // Cloudinary uses 'video' for audio files
    publicId: `story_${storyId}_${userId}_${Date.now()}`,
    tags: ['audio', 'story', 'private', userId],
    private: true,
  });
}

/**
 * Upload image for story thumbnails
 */
export async function uploadImageStory(
  imageBuffer: Buffer,
  storyId: string,
  userId: string
): Promise<UploadResult> {
  return uploadToCloudinary(imageBuffer, {
    folder: 'archivos-paranormales/images',
    resourceType: 'image',
    publicId: `thumb_${storyId}_${userId}_${Date.now()}`,
    tags: ['image', 'thumbnail', 'private', userId],
    private: true,
  });
}

/**
 * Generate a signed URL for private content access
 */
export function getSignedUrl(
  publicId: string,
  options: {
    resourceType?: 'image' | 'video' | 'raw';
    transformation?: any;
    expiresAt?: number;
  } = {}
): string {
  const signedUrl = cloudinary.url(publicId, {
    resource_type: options.resourceType || 'auto',
    type: 'private',
    sign_url: true,
    expires_at: options.expiresAt || Math.floor(Date.now() / 1000) + 3600, // 1 hour default
    transformation: options.transformation,
  });

  return signedUrl;
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: 'private',
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}

/**
 * Get optimized URL for public content (for thumbnails that can be public)
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    fetch_format: options.format || 'auto',
    quality: options.quality || 'auto',
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
  });
}

export { cloudinary };