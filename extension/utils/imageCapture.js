// converts an img element to base64 string using canvas
const captureImageAsBase64 = (imgElement) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = imgElement.naturalWidth || imgElement.width
      canvas.height = imgElement.naturalHeight || imgElement.height

      ctx.drawImage(imgElement, 0, 0)

      // get base64 string — remove the "data:image/png;base64," prefix
      const base64 = canvas.toDataURL('image/png').split(',')[1]
      resolve(base64)
    } catch (err) {
      reject(err)
    }
  })
}

// captures image from a URL directly
const captureImageFromUrl = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
      const base64 = canvas.toDataURL('image/png').split(',')[1]
      resolve(base64)
    }

    img.onerror = () => reject(new Error('Failed to load image from URL'))
    img.src = url
  })
}