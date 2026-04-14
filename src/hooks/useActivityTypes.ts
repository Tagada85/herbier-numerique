import { useCallback, useEffect, useState } from 'react'
import { getAllActivityTypes } from '../db/activity-types.db'
import type { ActivityType } from '../db/schema'

export function useActivityTypes() {
  const [types, setTypes] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const all = await getAllActivityTypes()
    setTypes(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { types, loading, refresh }
}
