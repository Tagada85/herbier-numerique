import { useEffect, useState } from 'react'
import { getAllZones, addZone, updateZone, deleteZone } from '../db/zones.db'
import type { Zone } from '../db/schema'

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const all = await getAllZones()
    setZones(all)
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    getAllZones().then((all) => {
      if (cancelled) return
      setZones(all)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

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
