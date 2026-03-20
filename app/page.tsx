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

  const handleRemoveDownload = async () => {
    if (!file) return

    setLoading(true)
    setError('')

    try {
      console.log('Starting background removal for file:', file.name, 'Size:', file.size)

      const formData = new FormData()
      formData.append('image', file)

      console.log('Sending request to /api/remove-bg')
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = 'Failed to remove background'
        try {
          const contentType = response.headers.get('content-type')
          console.log('Response content-type:', contentType)

          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } else {
            const text = await response.text()
            console.error('Non-JSON error response:', text.substring(0, 200))
            errorMessage = `Server returned ${response.status}: ${text.substring(0, 100)}`
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
        }

        throw new Error(errorMessage)
      }

      console.log('Getting blob from response')
      const blob = await response.blob()
      console.log('Blob size:', blob.size, 'Type:', blob.type)

      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      console.log('Background removal successful')
    } catch (err) {
      console.error('Error in handleRemoveDownload:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

    const handleDownload = () => {
    if (!resultUrl) return

    const link = document.createElement('a')
    link.href = resultUrl
    link.download = `no-background-${Date.now()}.png`
    link.click()
  }

  const handleReset = () => {
    setFile(null)
    setPreviewUrl('')
    setResultUrl('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PixelPerfect
            </span>
          </h1>
        </div>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          AI-Powered Background Removal for Professional Creators
        </p>
      </header>

      {/* Main Card */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden">
          {!file && (
            <div className="p-12">
              {/* Upload Area */}
              <div
                className={`relative group rounded-2xl border-3 border-dashed transition-all duration-300 ${
                  dragging
                    ? 'border-purple-500 bg-purple-50 scale-[1.02]'
                    : 'border-slate-200 hover:border-purple-400 hover:bg-slate-50'
                }`}
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
                  className="hidden"
                />

                <div className="py-16 px-8 text-center">
                  {/* Upload Icon */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-5xl">🖼️</span>
                  </div>

                  {/* Upload Text */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    Drop your image here
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Supports JPG, PNG, WEBP up to 25MB
                  </p>

                  {/* Browse Button */}
                  <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5">
                    Browse Files
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { icon: '⚡', title: 'Fast', desc: '3-5 seconds' },
                  { icon: '🎯', title: 'Precision', desc: 'AI-powered' },
                  { icon: '🔒', title: 'Private', desc: 'No storage' },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="text-center p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <p className="font-semibold text-slate-800 mb-1">
                      {feature.title}
                    </p>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Stage */}
          {file && !loading && !resultUrl && (
            <div className="p-8">
              <div className="mb-6">
                <div className="checkered-bg rounded-2xl overflow-hidden shadow-inner">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto object-contain max-h-[400px]"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-slate-600 font-medium">{file.name}</p>
                  <p className="text-sm text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  onClick={handleRemoveDownload}
                >
                  <span className="text-xl">✨</span>
                  Remove Background
                </button>
                <button
                  className="px-6 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={handleReset}
                >
                  <span className="text-xl">🔄</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading Stage */}
          {loading && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 border-4 border-pink-200 rounded-full"></div>
                <div className="absolute inset-2 border-4 border-pink-600 rounded-full border-b-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Processing Your Image
              </h3>
              <p className="text-slate-500">This usually takes 3-5 seconds...</p>
            </div>
          )}

          {/* Result Stage */}
          {resultUrl && (
            <div className="p-8">
              {/* Success Banner */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
                  <span className="text-xl">✅</span>
                  Background Removed Successfully!
                </p>
              </div>

              {/* Comparison */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Original
                  </p>
                  <div className="checkered-bg rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={previewUrl}
                      alt="Original"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Result
                  </p>
                  <div className="checkered-bg rounded-xl overflow-hidden shadow-lg ring-2 ring-purple-500/30">
                    <img
                      src={resultUrl}
                      alt="No Background"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex gap-3">
                <button
                  className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  onClick={handleDownload}
                >
                  <span className="text-xl">⬇️</span>
                  Download PNG
                </button>
                <button
                  className="px-6 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={handleReset}
                >
                  <span className="text-xl">🔄</span>
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 mx-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-700 font-semibold flex items-center justify-center gap-2">
                <span className="text-xl">❌</span>
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-400 text-sm">
          <p>Built with Next.js & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  )
}
