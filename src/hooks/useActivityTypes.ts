import { useEffect, useState } from 'react'
import { getAllActivityTypes } from '../db/activity-types.db'
import type { ActivityType } from '../db/schema'

export function useActivityTypes() {
  const [types, setTypes] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const all = await getAllActivityTypes()
    setTypes(all)
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    getAllActivityTypes().then((all) => {
      if (cancelled) return
      setTypes(all)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { types, loading, refresh }
}
