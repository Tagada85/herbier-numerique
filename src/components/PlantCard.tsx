import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Plant, Zone } from '../db/schema'
import { getPhotosByPlantId } from '../db/photos.db'
import { ConfidenceBadge } from './ConfidenceBadge'

interface PlantCardProps {
  plant: Plant
  zones: Zone[]
}

export function PlantCard({ plant, zones }: PlantCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)

  useEffect(() => {
    async function loadThumbnail() {
      const photos = await getPhotosByPlantId(plant.id)
      const primary = photos.find((p) => p.isPrimary) ?? photos[0]
      if (primary) {
        setThumbnailUrl(URL.createObjectURL(primary.blob))
      }
    }
    loadThumbnail()
  }, [plant.id])

  const plantZones = zones.filter((z) => plant.zoneIds.includes(z.id))

  return (
    <Link
      to={`/plants/${plant.id}`}
      className="flex gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={plant.commonName}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-20 bg-green-100 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">
          🌱
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-gray-900 truncate">
            {plant.commonName || plant.scientificName}
          </p>
          <ConfidenceBadge score={plant.plantnetScore} />
        </div>
        <p className="text-sm text-gray-500 italic truncate">
          {plant.scientificName}
        </p>
        <p className="text-xs text-gray-400">{plant.family}</p>
        {plantZones.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {plantZones.map((zone) => (
              <span
                key={zone.id}
                className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs"
              >
                {zone.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
