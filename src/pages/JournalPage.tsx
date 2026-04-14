import { useMemo, useState } from 'react'
import { ActivityCard } from '../components/ActivityCard'
import { ActivityForm } from '../components/ActivityForm'
import { useActivities } from '../hooks/useActivities'
import { useActivityTypes } from '../hooks/useActivityTypes'
import { usePlants } from '../hooks/usePlants'
import { useZones } from '../hooks/useZones'
import type { Activity } from '../db/schema'

export function JournalPage() {
  const { activities, loading, createActivity, removeActivity } =
    useActivities()
  const { types, loading: loadingTypes } = useActivityTypes()
  const { plants } = usePlants()
  const { zones } = useZones()
  const [showForm, setShowForm] = useState(false)

  const typesById = useMemo(
    () => new Map(types.map((t) => [t.id, t])),
    [types],
  )
  const plantsById = useMemo(
    () => new Map(plants.map((p) => [p.id, p])),
    [plants],
  )
  const zonesById = useMemo(
    () => new Map(zones.map((z) => [z.id, z])),
    [zones],
  )

  async function handleSubmit(input: Omit<Activity, 'id' | 'createdAt'>) {
    await createActivity(input)
    setShowForm(false)
  }

  if (loading || loadingTypes) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Journal</h1>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            + Nouvelle activité
          </button>
        )}
      </div>

      {showForm && (
        <ActivityForm
          types={types}
          plants={plants}
          zones={zones}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {activities.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Aucune activité enregistrée</p>
          <p className="text-xs mt-1">
            Commence par noter un semis, un arrosage...
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              type={typesById.get(activity.typeId)}
              plant={
                activity.plantId
                  ? plantsById.get(activity.plantId)
                  : undefined
              }
              zone={
                activity.zoneId ? zonesById.get(activity.zoneId) : undefined
              }
              onDelete={removeActivity}
            />
          ))}
        </div>
      )}
    </div>
  )
}
