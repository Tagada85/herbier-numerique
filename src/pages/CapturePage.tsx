import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhotoCapture } from '../components/PhotoCapture'
import { IdentificationResults } from '../components/IdentificationResults'
import { ZoneSelector } from '../components/ZoneSelector'
import { useIdentify } from '../hooks/useIdentify'
import { usePlants } from '../hooks/usePlants'
import { useZones } from '../hooks/useZones'
import type { IdentificationResult } from '../types/plantnet.types'

export function CapturePage() {
  const navigate = useNavigate()
  const { results, loading, error, identify, reset } = useIdentify()
  const { cataloguePlant } = usePlants()
  const { zones, createZone } = useZones()

  const [capturedFile, setCapturedFile] = useState<File | null>(null)
  const [selectedResult, setSelectedResult] =
    useState<IdentificationResult | null>(null)
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  async function handleCapture(file: File) {
    setCapturedFile(file)
    setSelectedResult(null)
    setSelectedZoneIds([])
    await identify(file)
  }

  function handleSelectResult(result: IdentificationResult) {
    setSelectedResult(result)
  }

  function handleToggleZone(zoneId: string) {
    setSelectedZoneIds((prev) =>
      prev.includes(zoneId)
        ? prev.filter((id) => id !== zoneId)
        : [...prev, zoneId],
    )
  }

  async function handleCreateZone(name: string) {
    const zone = await createZone(name)
    setSelectedZoneIds((prev) => [...prev, zone.id])
  }

  async function handleConfirm() {
    if (!selectedResult || !capturedFile) return

    setSaving(true)
    const blob = new Blob([await capturedFile.arrayBuffer()], {
      type: capturedFile.type,
    })

    const { plant, isNew } = await cataloguePlant(
      {
        scientificName: selectedResult.scientificName,
        commonName: selectedResult.commonName,
        family: selectedResult.family,
        genus: selectedResult.genus,
        plantnetScore: selectedResult.score,
        zoneIds: selectedZoneIds,
      },
      blob,
    )

    setSaving(false)

    const message = isNew
      ? `${plant.commonName || plant.scientificName} ajoutée à l'herbier !`
      : `Photo ajoutée à la fiche de ${plant.commonName || plant.scientificName}`
    alert(message)

    navigate(`/plants/${plant.id}`)
  }

  function handleReset() {
    setCapturedFile(null)
    setSelectedResult(null)
    setSelectedZoneIds([])
    reset()
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-xl font-bold text-gray-900">Identifier une plante</h1>

      <PhotoCapture onCapture={handleCapture} disabled={loading} />

      {loading && (
        <div className="flex items-center justify-center gap-2 text-green-600">
          <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <span>Identification en cours...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl">
          <p className="font-medium">Erreur</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {!selectedResult && (
        <IdentificationResults
          results={results}
          onSelect={handleSelectResult}
        />
      )}

      {selectedResult && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="font-medium text-green-800">
              {selectedResult.commonName || selectedResult.scientificName}
            </p>
            <p className="text-sm text-green-600 italic">
              {selectedResult.scientificName}
            </p>
            <p className="text-xs text-green-500 mt-1">
              {selectedResult.family} — {Math.round(selectedResult.score * 100)}
              % de confiance
            </p>
          </div>

          <ZoneSelector
            zones={zones}
            selectedIds={selectedZoneIds}
            onToggle={handleToggleZone}
            onCreate={handleCreateZone}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Enregistrement...' : 'Valider'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
