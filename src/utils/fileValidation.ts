// 이미지 파일 유효성 검사
export const validateImageFile = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']

  if (file.size > maxSize) {
    return '파일 크기는 10MB 이하여야 합니다'
  }

  if (!allowedTypes.includes(file.type)) {
    return 'PNG, JPG, JPEG, GIF, WebP 형식만 지원합니다'
  }

  return null
}

// 파일 크기를 읽기 쉬운 형식으로 변환
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
