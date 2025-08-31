"use client"

// Helper functions for Cloudinary operations
export const uploadImage = async (file: File | string, folder: string = 'konvograd'): Promise<string> => {
  try {
    if (typeof file === 'string') {
      // If file is a base64 string or URL, use direct upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'ml_default')
      formData.append('folder', folder)
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/dhw3s8i57/image/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      const result = await response.json()
      return result.secure_url
    } else {
      // If file is a File object, convert to base64 and upload
      const base64 = await fileToBase64(file)
      const formData = new FormData()
      formData.append('file', base64)
      formData.append('upload_preset', 'ml_default')
      formData.append('folder', folder)
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/dhw3s8i57/image/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      const result = await response.json()
      return result.secure_url
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

export const uploadFile = async (file: File | string, folder: string = 'konvograd'): Promise<string> => {
  try {
    if (typeof file === 'string') {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'ml_default')
      formData.append('folder', folder)
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/dhw3s8i57/raw/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload file')
      }
      
      const result = await response.json()
      return result.secure_url
    } else {
      const base64 = await fileToBase64(file)
      const formData = new FormData()
      formData.append('file', base64)
      formData.append('upload_preset', 'ml_default')
      formData.append('folder', folder)
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/dhw3s8i57/raw/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload file')
      }
      
      const result = await response.json()
      return result.secure_url
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload file')
  }
}

export async function deleteFile(publicId: string): Promise<void> {
  try {
    // For now, we'll just log the request
    throw new Error("File deletion requires server-side implementation");
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}

// Convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Get optimized image URL
export const getOptimizedImageUrl = (url: string, width: number = 400, height: number = 400): string => {
  if (!url.includes('cloudinary.com')) return url
  
  const baseUrl = url.split('/upload/')[0] + '/upload/'
  const imagePath = url.split('/upload/')[1]
  
  return `${baseUrl}c_fill,w_${width},h_${height},q_auto/${imagePath}`
}

// Get thumbnail URL
export const getThumbnailUrl = (url: string, size: number = 150): string => {
  return getOptimizedImageUrl(url, size, size)
}
