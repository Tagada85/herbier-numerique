import { useCallback, useEffect, useState } from 'react'
import { getAllZones, addZone, updateZone, deleteZone } from '../db/zones.db'
import type { Zone } from '../db/schema'

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const all = await getAllZones()
    setZones(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function createZone(name: string, description = '') {
    const zone = await addZone(name, description)
    await refresh()
    return zone
  }

  async function renameZone(id: string, name: string) {
    await updateZone(id, { name })
    await refresh()
  }

  async function removeZone(id: string) {
    await deleteZone(id)
    await refresh()
  }

  return { zones, loading, refresh, createZone, renameZone, removeZone }
}
