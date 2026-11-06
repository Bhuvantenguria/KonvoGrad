"use client"

// Cloudinary configuration from environment variables
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'dhw3s8i57'
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'

// Helper functions for Cloudinary operations
export const uploadImage = async (file: File | string, folder: string = 'konvograd'): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', folder)
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload image')
    }
    
    const result = await response.json()
    return result.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

export const uploadFile = async (file: File | string, folder: string = 'konvograd'): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', folder)
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload file')
    }
    
    const result = await response.json()
    return result.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload file')
  }
}

export async function deleteFile(publicId: string): Promise<void> {
  try {
    console.warn("File deletion requested for:", publicId)
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}

// Convert File to base64 if needed for legacy components
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Get optimized image URL
export const getOptimizedImageUrl = (url: string, width: number = 400, height: number = 400): string => {
  if (!url || !url.includes('cloudinary.com')) return url
  
  const parts = url.split('/upload/')
  if (parts.length < 2) return url
  
  const baseUrl = parts[0] + '/upload/'
  const imagePath = parts[1]
  
  return `${baseUrl}c_fill,w_${width},h_${height},q_auto/${imagePath}`
}

// Get thumbnail URL
export const getThumbnailUrl = (url: string, size: number = 150): string => {
  return getOptimizedImageUrl(url, size, size)
}
