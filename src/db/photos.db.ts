import { getDB, type Photo } from './schema'

export async function getPhotosByPlantId(plantId: string): Promise<Photo[]> {
  const db = await getDB()
  return db.getAllFromIndex('photos', 'by-plant-id', plantId)
}

export async function addPhoto(
  photo: Omit<Photo, 'id' | 'createdAt'>,
): Promise<Photo> {
  const db = await getDB()
  const newPhoto: Photo = {
    ...photo,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await db.add('photos', newPhoto)
  return newPhoto
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('photos', id)
}

export async function deletePhotosByPlantId(plantId: string): Promise<void> {
  const db = await getDB()
  const photos = await db.getAllFromIndex('photos', 'by-plant-id', plantId)
  const tx = db.transaction('photos', 'readwrite')
  for (const photo of photos) {
    tx.store.delete(photo.id)
  }
  await tx.done
}
