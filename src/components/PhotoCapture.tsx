import { useRef, useState } from 'react'

interface PhotoCaptureProps {
  onCapture: (file: File) => void
  disabled?: boolean
}

export function PhotoCapture({ onCapture, disabled }: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    onCapture(file)
  }

  function handleReset() {
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
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
        <label
          className={`flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-green-400 rounded-xl cursor-pointer transition-colors ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-green-600 hover:bg-green-50'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-green-500 mb-2"
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
          <span className="text-sm text-gray-400 mt-1">
            ou choisir depuis la galerie
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}
