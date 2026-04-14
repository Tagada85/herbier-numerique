import type { Activity, ActivityType, Plant, Zone } from '../db/schema'

interface ActivityCardProps {
  activity: Activity
  type: ActivityType | undefined
  plant: Plant | undefined
  zone: Zone | undefined
  onDelete: (id: string) => void
}

export function ActivityCard({
  activity,
  type,
  plant,
  zone,
  onDelete,
}: ActivityCardProps) {
  const formattedDate = new Date(activity.date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wide">
              {type?.label ?? 'Type inconnu'}
            </span>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(activity.id)}
          aria-label="Supprimer l'activité"
          className="text-gray-300 hover:text-red-500 text-sm p-1"
        >
          ✕
        </button>
      </div>

      {(plant || zone) && (
        <div className="flex flex-wrap gap-1.5 text-xs">
          {plant && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
              🌱 {plant.commonName || plant.scientificName}
            </span>
          )}
          {zone && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
              📍 {zone.name}
            </span>
          )}
        </div>
      )}

      {activity.notes && (
        <p className="text-sm text-gray-600 whitespace-pre-wrap">
          {activity.notes}
        </p>
      )}
    </div>
  )
}
