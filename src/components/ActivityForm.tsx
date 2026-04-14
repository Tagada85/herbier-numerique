import { useState } from 'react'
import type { Activity, ActivityType, Plant, Zone } from '../db/schema'

interface ActivityFormProps {
  types: ActivityType[]
  plants: Plant[]
  zones: Zone[]
  onSubmit: (input: Omit<Activity, 'id' | 'createdAt'>) => Promise<void>
  onCancel: () => void
}

function todayIso(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function ActivityForm({
  types,
  plants,
  zones,
  onSubmit,
  onCancel,
}: ActivityFormProps) {
  const [typeId, setTypeId] = useState<string>(types[0]?.id ?? '')
  const [plantId, setPlantId] = useState<string>('')
  const [zoneId, setZoneId] = useState<string>('')
  const [date, setDate] = useState<string>(todayIso())
  const [notes, setNotes] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!typeId || !date) return

    setSubmitting(true)
    await onSubmit({
      typeId,
      plantId: plantId || null,
      zoneId: zoneId || null,
      date,
      notes: notes.trim(),
    })
    setSubmitting(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 space-y-4"
    >
      <h2 className="font-semibold text-gray-800">Nouvelle activité</h2>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          Type
        </label>
        <select
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 bg-white"
        >
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 bg-white"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          Plante (facultatif)
        </label>
        <select
          value={plantId}
          onChange={(e) => setPlantId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 bg-white"
        >
          <option value="">— Aucune —</option>
          {plants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.commonName || p.scientificName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          Zone (facultatif)
        </label>
        <select
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 bg-white"
        >
          <option value="">— Aucune —</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Détails de l'activité..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 bg-white resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || !typeId || !date}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-green-600 transition-colors"
        >
          {submitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
