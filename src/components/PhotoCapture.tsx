import { useRef, useState } from 'react'

interface PhotoCaptureProps {
  onCapture: (file: File) => void
  disabled?: boolean
}

export function PhotoCapture({ onCapture, disabled }: PhotoCaptureProps) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    onCapture(file)
  }

  function handleReset() {
    setPreview(null)
    if (cameraRef.current) cameraRef.current.value = ''
    if (galleryRef.current) galleryRef.current.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Photo capturée"
            className="w-64 h-64 object-cover rounded-xl shadow-lg"
          />
          <button
            type="button"
            onClick={handleReset}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow"
          >
            X
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <label
            className={`flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-green-400 rounded-xl cursor-pointer transition-colors ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-green-600 hover:bg-green-50'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-green-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-green-700 font-medium">Prendre une photo</span>
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleChange}
              disabled={disabled}
              className="hidden"
            />
          </label>

          <label
            className={`flex flex-col items-center justify-center w-64 h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-colors ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-400 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-500 text-sm font-medium">Choisir depuis la galerie</span>
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              disabled={disabled}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  )
}
