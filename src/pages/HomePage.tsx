import { useState } from 'react'
import { PlantCard } from '../components/PlantCard'
import { usePlants } from '../hooks/usePlants'
import { useZones } from '../hooks/useZones'

export function HomePage() {
  const { plants, loading } = usePlants()
  const { zones } = useZones()
  const [search, setSearch] = useState('')
  const [filterZoneId, setFilterZoneId] = useState<string | null>(null)

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      !search ||
      plant.commonName.toLowerCase().includes(search.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(search.toLowerCase())

    const matchesZone =
      !filterZoneId || plant.zoneIds.includes(filterZoneId)

    return matchesSearch && matchesZone
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <h1 className="text-xl font-bold text-gray-900">Mon Herbier</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher une plante..."
        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500"
      />

      {zones.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterZoneId(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !filterZoneId
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Toutes
          </button>
          {zones.map((zone) => (
            <button
              key={zone.id}
              type="button"
              onClick={() =>
                setFilterZoneId(filterZoneId === zone.id ? null : zone.id)
              }
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterZoneId === zone.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>
      )}

      {filteredPlants.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🌱</p>
          {plants.length === 0 ? (
            <>
              <p className="font-medium">Ton herbier est vide</p>
              <p className="text-sm mt-1">
                Commence par identifier une plante !
              </p>
            </>
          ) : (
            <p className="font-medium">Aucun résultat</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} zones={zones} />
          ))}
        </div>
      )}
    </div>
  )
}
