import type { IdentificationResult } from '../types/plantnet.types'
import { ConfidenceBadge } from './ConfidenceBadge'

interface IdentificationResultsProps {
  results: IdentificationResult[]
  onSelect: (result: IdentificationResult) => void
}

export function IdentificationResults({
  results,
  onSelect,
}: IdentificationResultsProps) {
  if (results.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">
        Résultats d'identification
      </h2>
      <ul className="space-y-2">
        {results.slice(0, 5).map((result) => (
          <li key={result.scientificName}>
            <button
              type="button"
              onClick={() => onSelect(result)}
              className="w-full text-left p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-green-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {result.commonName || result.scientificName}
                  </p>
                  <p className="text-sm text-gray-500 italic truncate">
                    {result.scientificName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {result.family}
                  </p>
                </div>
                <ConfidenceBadge score={result.score} />
              </div>
              {result.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {result.images.map((img) => (
                    <img
                      key={img.url}
                      src={img.url}
                      alt={img.alt}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
