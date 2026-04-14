import { useCallback, useEffect, useState } from 'react'
import {
  getAllActivities,
  addActivity,
  deleteActivity,
} from '../db/activities.db'
import type { Activity } from '../db/schema'

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const all = await getAllActivities()
    setActivities(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function createActivity(input: Omit<Activity, 'id' | 'createdAt'>) {
    const activity = await addActivity(input)
    await refresh()
    return activity
  }

  async function removeActivity(id: string) {
    await deleteActivity(id)
    await refresh()
  }

  return { activities, loading, refresh, createActivity, removeActivity }
}
