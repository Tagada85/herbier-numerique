import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useZones } from '../hooks/useZones'

export function ZonesPage() {
  const navigate = useNavigate()
  const { zones, loading, createZone, renameZone, removeZone } = useZones()
  const [newZoneName, setNewZoneName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const name = newZoneName.trim()
    if (!name) return
    await createZone(name)
    setNewZoneName('')
  }

  function startEditing(id: string, currentName: string) {
    setEditingId(id)
    setEditingName(currentName)
  }

  async function handleRename(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId || !editingName.trim()) return
    await renameZone(editingId, editingName.trim())
    setEditingId(null)
    setEditingName('')
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer la zone "${name}" ?`)) return
    await removeZone(id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-green-600 text-sm font-medium"
      >
        ← Retour
      </button>

      <h1 className="text-xl font-bold text-gray-900">Mes zones</h1>

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newZoneName}
          onChange={(e) => setNewZoneName(e.target.value)}
          placeholder="Nouvelle zone..."
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500"
        />
        <button
          type="submit"
          disabled={!newZoneName.trim()}
          className="px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-green-600 transition-colors"
        >
          Ajouter
        </button>
      </form>

      {zones.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="font-medium">Aucune zone</p>
          <p className="text-sm mt-1">Crée ta première zone de potager</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {zones.map((zone) => (
            <li
              key={zone.id}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200"
            >
              {editingId === zone.id ? (
                <form
                  onSubmit={handleRename}
                  className="flex-1 flex gap-2"
                >
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    className="flex-1 px-3 py-1.5 border border-green-400 rounded-lg text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-sm"
                  >
                    Annuler
                  </button>
                </form>
              ) : (
                <>
                  <span className="flex-1 font-medium text-gray-800">
                    {zone.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEditing(zone.id, zone.name)}
                    className="px-3 py-1.5 text-gray-500 hover:text-green-600 text-sm transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(zone.id, zone.name)}
                    className="px-3 py-1.5 text-gray-400 hover:text-red-500 text-sm transition-colors"
                  >
                    Supprimer
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
