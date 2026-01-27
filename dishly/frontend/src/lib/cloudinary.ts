/**
 * Client-side Cloudinary upload utility
 * Uploads images through our API route which handles server-side Cloudinary integration
 */

export async function uploadToCloudinary(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export function getCloudinaryImageUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    crop?: string
    quality?: string
    format?: string
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`

  let transformations = ''
  if (options) {
    const transforms: string[] = []
    if (options.width) transforms.push(`w_${options.width}`)
    if (options.height) transforms.push(`h_${options.height}`)
    if (options.crop) transforms.push(`c_${options.crop}`)
    if (options.quality) transforms.push(`q_${options.quality}`)
    if (options.format) transforms.push(`f_${options.format}`)
    if (transforms.length > 0) {
      transformations = `/${transforms.join(',')}`
    }
  }

  return `${baseUrl}${transformations}/${publicId}`
}

