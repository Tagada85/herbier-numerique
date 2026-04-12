import { getDB, type Plant } from './schema'

export async function getAllPlants(): Promise<Plant[]> {
  const db = await getDB()
  return db.getAll('plants')
}

export async function getPlantById(id: string): Promise<Plant | undefined> {
  const db = await getDB()
  return db.get('plants', id)
}

export async function findByScientificName(
  scientificName: string,
): Promise<Plant | undefined> {
  const db = await getDB()
  return db.getFromIndex('plants', 'by-scientific-name', scientificName)
}

export async function addPlant(
  plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Plant> {
  const db = await getDB()
  const now = new Date().toISOString()
  const newPlant: Plant = {
    ...plant,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  await db.add('plants', newPlant)
  return newPlant
}

export async function updatePlant(
  id: string,
  updates: Partial<Omit<Plant, 'id' | 'createdAt'>>,
): Promise<Plant | undefined> {
  const db = await getDB()
  const existing = await db.get('plants', id)
  if (!existing) return undefined

  const updated: Plant = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  await db.put('plants', updated)
  return updated
}

export async function deletePlant(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('plants', id)
}
