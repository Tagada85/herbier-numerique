import { useState } from 'react'
import type { Zone } from '../db/schema'

interface ZoneSelectorProps {
  zones: Zone[]
  selectedIds: string[]
  onToggle: (zoneId: string) => void
  onCreate: (name: string) => void
}

export function ZoneSelector({
  zones,
  selectedIds,
  onToggle,
  onCreate,
}: ZoneSelectorProps) {
  const [newZoneName, setNewZoneName] = useState('')

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const name = newZoneName.trim()
    if (!name) return
    onCreate(name)
    setNewZoneName('')
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">
        Zone(s) du potager
      </h3>

      {zones.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {zones.map((zone) => {
            const isSelected = selectedIds.includes(zone.id)
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => onToggle(zone.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {zone.name}
              </button>
            )
          })}
        </div>
      )}

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newZoneName}
          onChange={(e) => setNewZoneName(e.target.value)}
          placeholder="Nouvelle zone..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
        />
        <button
          type="submit"
          disabled={!newZoneName.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
        >
          +
        </button>
      </form>
    </div>
  )
}
