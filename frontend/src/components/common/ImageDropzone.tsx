import { useRef, useState, type DragEvent, type ChangeEvent, type KeyboardEvent } from 'react'

interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  label?: string
}

export function ImageDropzone({
  onFilesSelected,
  accept = 'image/*',
  multiple = false,
  maxFiles = 1,
  label = '이미지를 드래그하거나 클릭해서 업로드',
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, maxFiles)

    if (droppedFiles.length > 0) {
      onFilesSelected(droppedFiles)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  // 키보드 접근성: Enter/Space로 파일 선택 다이얼로그 열기
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []).slice(0, maxFiles)
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles)
    }
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${isDragging ? '#cbb7fb' : '#dcd7d3'}`,
        borderRadius: '8px',
        padding: '32px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragging ? 'rgba(203, 183, 251, 0.05)' : 'transparent',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
        userSelect: 'none',
        outline: 'none',
      }}
      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px #cbb7fb' }}
      onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
      <div style={{ pointerEvents: 'none' }}>
        <div style={{
          width: '40px',
          height: '40px',
          margin: '0 auto 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDragging ? '#cbb7fb' : '#dcd7d3'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p style={{
          fontSize: '14px',
          color: '#292827',
          fontWeight: '500',
          marginBottom: '4px',
        }}>
          {label}
        </p>
        <p style={{
          fontSize: '12px',
          color: '#a09a94',
        }}>
          PNG, JPG, WEBP 지원
          {maxFiles > 1 && ` · 최대 ${maxFiles}개`}
        </p>
      </div>
    </div>
  )
}
