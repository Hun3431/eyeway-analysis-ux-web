import { useState, useRef, useEffect } from 'react'
import { List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Highlight } from '@/types'

interface ImageWithHighlightsProps {
  imageUrl: string
  highlights?: Highlight[]
  imageAlt?: string
  originalWidth?: number // 백엔드에서 받은 원본 이미지 너비
  originalHeight?: number // 백엔드에서 받은 원본 이미지 높이
}

export default function ImageWithHighlights({
  imageUrl,
  highlights = [],
  imageAlt = '분석 이미지',
  originalWidth,
  originalHeight,
}: ImageWithHighlightsProps) {
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [scale, setScale] = useState({ x: 1, y: 1 })
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 })
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 이미지 로드 및 리사이즈 시 스케일 재계산
  useEffect(() => {
    const calculateScale = () => {
      if (imgRef.current && containerRef.current) {
        const img = imgRef.current
        const container = containerRef.current
        
        // 백엔드에서 제공한 원본 크기를 우선 사용, 없으면 이미지 naturalSize 사용
        const naturalWidth = originalWidth || img.naturalWidth
        const naturalHeight = originalHeight || img.naturalHeight
        const displayWidth = img.clientWidth
        const displayHeight = img.clientHeight

        const newScale = {
          x: displayWidth / naturalWidth,
          y: displayHeight / naturalHeight,
        }

        // 이미지와 컨테이너의 위치 차이 계산 (중앙 정렬로 인한 offset)
        const imgRect = img.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const newOffset = {
          x: imgRect.left - containerRect.left,
          y: imgRect.top - containerRect.top,
        }

        setScale(newScale)
        setImageOffset(newOffset)

        // 디버깅: 스케일 정보 로그 (개발 모드에서만)
        if (import.meta.env.DEV && highlights && highlights.length > 0) {
          console.log('🎯 Image Highlight Scale Info:', {
            original: { width: naturalWidth, height: naturalHeight },
            fromBackend: originalWidth && originalHeight ? 'Yes ✓' : 'No (using naturalSize)',
            display: { width: displayWidth, height: displayHeight },
            scale: newScale,
            offset: newOffset,
            highlightCount: highlights.length
          })
        }
      }
    }

    if (imageLoaded) {
      // 작은 delay를 줘서 DOM이 완전히 렌더링된 후 계산
      setTimeout(calculateScale, 100)
      
      // 윈도우 리사이즈 시에도 재계산
      window.addEventListener('resize', calculateScale)
      return () => window.removeEventListener('resize', calculateScale)
    }
  }, [imageLoaded, highlights, originalWidth, originalHeight])

  const getSeverityColor = (severity: Highlight['severity']) => {
    switch (severity) {
      case 'high':
        return 'rgba(239, 68, 68, 0.3)' // 빨간색
      case 'medium':
        return 'rgba(245, 158, 11, 0.3)' // 주황색
      case 'low':
        return 'rgba(59, 130, 246, 0.3)' // 파란색
    }
  }

  const getSeverityBorderColor = (severity: Highlight['severity']) => {
    switch (severity) {
      case 'high':
        return 'rgb(239, 68, 68)' // 빨간색
      case 'medium':
        return 'rgb(245, 158, 11)' // 주황색
      case 'low':
        return 'rgb(59, 130, 246)' // 파란색
    }
  }

  const getSeverityLabel = (severity: Highlight['severity']) => {
    switch (severity) {
      case 'high':
        return '높음'
      case 'medium':
        return '중간'
      case 'low':
        return '낮음'
    }
  }

  // highlights가 없거나 비어있으면 일반 이미지만 표시
  if (!highlights || highlights.length === 0) {
    return (
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-auto rounded-lg border border-border"
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* 이미지 + 버튼 영역 */}
      <div className="relative">
        <div ref={containerRef} className="relative w-full max-h-[80dvh] overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <img
            ref={imgRef}
            src={imageUrl}
            alt={imageAlt}
            className="max-w-full max-h-[80dvh] h-auto object-contain border border-border rounded-lg block"
            onLoad={() => setImageLoaded(true)}
          />
          
          {imageLoaded && highlights.map((highlight) => {
            // 원본 이미지 좌표를 표시 크기에 맞게 조정
            const scaledX = highlight.coordinates.x * scale.x
            const scaledY = highlight.coordinates.y * scale.y
            const scaledWidth = highlight.coordinates.width * scale.x
            const scaledHeight = highlight.coordinates.height * scale.y

            // 이미지 offset을 더해서 중앙 정렬된 이미지 위에 정확히 배치
            const finalX = scaledX + imageOffset.x
            const finalY = scaledY + imageOffset.y
            const isSelected = selectedHighlight?.id === highlight.id

            return (
              <div key={highlight.id}>
                {/* 하이라이트 박스 */}
                <div
                  onClick={() => setSelectedHighlight(
                    isSelected ? null : highlight
                  )}
                  style={{
                    position: 'absolute',
                    left: `${finalX}px`,
                    top: `${finalY}px`,
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                    backgroundColor: getSeverityColor(highlight.severity),
                    border: `2px solid ${getSeverityBorderColor(highlight.severity)}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    zIndex: isSelected ? 20 : 10,
                    pointerEvents: 'auto',
                  }}
                  className="hover:scale-105 rounded"
                >
                  {/* 하이라이트 번호 */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '-10px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: getSeverityBorderColor(highlight.severity),
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {highlight.id}
                  </div>
                </div>

                {/* 툴팁 (선택 시 표시) */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${finalX}px`,
                      top: `${finalY + scaledHeight + 10}px`,
                      maxWidth: '300px',
                      zIndex: 30,
                      pointerEvents: 'none',
                    }}
                    className="bg-white dark:bg-dark-card border border-border rounded-lg p-3 shadow-xl"
                  >
                    {/* 화살표 */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        left: '20px',
                        width: '12px',
                        height: '12px',
                        backgroundColor: 'inherit',
                        border: 'inherit',
                        borderRight: 'none',
                        borderBottom: 'none',
                        transform: 'rotate(45deg)',
                      }}
                    />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm text-black dark:text-dark-text pr-2">
                          {highlight.element}
                        </h4>
                        <span
                          className="px-2 py-0.5 text-xs font-medium rounded-full text-white flex-shrink-0"
                          style={{ backgroundColor: getSeverityBorderColor(highlight.severity) }}
                        >
                          {getSeverityLabel(highlight.severity)}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        {highlight.issue}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 하이라이트 버튼 (이미지 위에 floating) */}
        <div className="absolute top-4 right-4 z-20">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-2 shadow-lg">
                <List className="h-4 w-4" />
                이슈 목록 ({highlights.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80dvh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>발견된 UX 이슈</DialogTitle>
                <DialogDescription>
                  총 {highlights.length}개의 이슈가 발견되었습니다. 이미지 위의 번호를 클릭하면 상세 내용을 확인할 수 있습니다.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 mt-4">
                {/* 하이라이트 목록만 표시 */}
                {highlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className="flex items-start gap-3 p-4 bg-white dark:bg-dark-card border border-border rounded-lg hover:shadow-md hover:border-primary/50 transition-all"
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: getSeverityBorderColor(highlight.severity) }}
                    >
                      {highlight.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-black dark:text-dark-text mb-1">
                        {highlight.element}
                      </p>
                      <p className="text-sm text-muted">
                        {highlight.issue}
                      </p>
                    </div>
                    <span
                      className="flex-shrink-0 px-2 py-1 text-xs rounded-full text-white font-medium"
                      style={{ backgroundColor: getSeverityBorderColor(highlight.severity) }}
                    >
                      {getSeverityLabel(highlight.severity)}
                    </span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
