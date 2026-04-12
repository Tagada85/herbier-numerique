import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlantById } from '../db/plants.db'
import { usePhotos } from '../hooks/usePhotos'
import { useZones } from '../hooks/useZones'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import type { Plant } from '../db/schema'

export function PlantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [plant, setPlant] = useState<Plant | null>(null)
  const [loading, setLoading] = useState(true)
  const { photos } = usePhotos(id)
  const { zones } = useZones()

  useEffect(() => {
    async function load() {
      if (!id) return
      const p = await getPlantById(id)
      setPlant(p ?? null)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Plante introuvable</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 text-green-600 underline"
        >
          Retour à l'herbier
        </button>
      </div>
    )
  }

  const plantZones = zones.filter((z) => plant.zoneIds.includes(z.id))

  return (
    <div className="p-4 space-y-6 pb-24">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-green-600 text-sm font-medium"
      >
        ← Retour
      </button>

      {photos.length > 0 && (
        <div className="flex gap-3 overflow-x-auto">
          {photos.map((photo) => (
            <img
              key={photo.id}
              src={URL.createObjectURL(photo.blob)}
              alt={plant.commonName}
              className="w-48 h-48 object-cover rounded-xl shadow flex-shrink-0"
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {plant.commonName || plant.scientificName}
          </h1>
          <ConfidenceBadge score={plant.plantnetScore} />
        </div>
        <p className="text-gray-500 italic">{plant.scientificName}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Famille
          </p>
          <p className="font-medium text-gray-800 mt-1">{plant.family}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Genre
          </p>
          <p className="font-medium text-gray-800 mt-1">{plant.genus}</p>
        </div>
      </div>

      {plantZones.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            Zones
          </p>
          <div className="flex flex-wrap gap-2">
            {plantZones.map((zone) => (
              <span
                key={zone.id}
                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {zone.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400">
        <p>Ajoutée le {new Date(plant.createdAt).toLocaleDateString('fr-FR')}</p>
        <p>{photos.length} photo{photos.length > 1 ? 's' : ''}</p>
      </div>
    </div>
  )
}
