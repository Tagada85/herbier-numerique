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

export async function deleteZone(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('zones', id)
}
