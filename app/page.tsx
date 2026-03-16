'use client'

import { useState, useCallback } from 'react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [resultUrl, setResultUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile)
      setPreviewUrl(URL.createObjectURL(droppedFile))
      setError('')
      setResultUrl('')
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setError('')
      setResultUrl('')
    }
  }

  const handleRemoveBackground = async () => {
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove background')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!resultUrl) return

    const link = document.createElement('a')
    link.href = resultUrl
    link.download = 'no-background.png'
    link.click()
  }

  const handleReset = () => {
    setFile(null)
    setPreviewUrl('')
    setResultUrl('')
    setError('')
  }

  return (
    <div className="container">
      <div className="card">
        <div className="title">
          <h1>🎨 Background Remover</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Upload an image to remove its background
          </p>
        </div>

        {!file && (
          <div
            className={`upload-area ${dragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Drop your image here
            </p>
            <p style={{ color: '#999' }}>or click to browse</p>
          </div>
        )}

        {file && !loading && !resultUrl && (
          <div>
            <div className="image-container">
              <img src={previewUrl} alt="Preview" />
              <p style={{ marginTop: '1rem' }}>{file.name}</p>
            </div>
            <button className="button" onClick={handleRemoveBackground}>
              ✨ Remove Background
            </button>
            <button
              className="button"
              onClick={handleReset}
              style={{ background: '#718096', marginTop: '0.5rem' }}
            >
              🔄 Choose Different Image
            </button>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Removing background... This may take a few seconds.</p>
          </div>
        )}

        {resultUrl && (
          <div>
            <div className="success">
              ✅ Background removed successfully!
            </div>
            <div className="preview">
              <div className="image-container">
                <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Original</p>
                <img src={previewUrl} alt="Original" />
              </div>
              <div className="image-container">
                <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>No Background</p>
                <img src={resultUrl} alt="No Background" />
              </div>
            </div>
            <button className="download-button" onClick={handleDownload}>
              ⬇️ Download PNG
            </button>
            <button
              className="button"
              onClick={handleReset}
              style={{ background: '#718096' }}
            >
              🔄 Process Another Image
            </button>
          </div>
        )}

        {error && (
          <div className="error">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  )
}
