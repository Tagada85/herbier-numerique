import { getDB, type Zone } from './schema'

export async function getAllZones(): Promise<Zone[]> {
  const db = await getDB()
  return db.getAll('zones')
}

export async function addZone(
  name: string,
  description = '',
): Promise<Zone> {
  const db = await getDB()
  const zone: Zone = {
    id: crypto.randomUUID(),
    name,
    description,
    createdAt: new Date().toISOString(),
  }
  await db.add('zones', zone)
  return zone
}

export async function updateZone(
  id: string,
  updates: Partial<Omit<Zone, 'id' | 'createdAt'>>,
): Promise<Zone | undefined> {
  const db = await getDB()
  const existing = await db.get('zones', id)
  if (!existing) return undefined

  const updated: Zone = { ...existing, ...updates }
  await db.put('zones', updated)
  return updated
}

export async function deleteZone(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('zones', id)
}
