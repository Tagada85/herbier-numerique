import { useEffect, useState } from 'react'
import { getPhotosByPlantId, addPhoto, deletePhoto } from '../db/photos.db'
import type { Photo } from '../db/schema'

export function usePhotos(plantId: string | undefined) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    if (!plantId) {
      setPhotos([])
      setLoading(false)
      return
    }
    const all = await getPhotosByPlantId(plantId)
    setPhotos(all)
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    const load = plantId
      ? getPhotosByPlantId(plantId)
      : Promise.resolve<Photo[]>([])
    load.then((all) => {
      if (cancelled) return
      setPhotos(all)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [plantId])

  async function addPhotoToPlant(blob: Blob) {
    if (!plantId) return
    await addPhoto({
      plantId,
      blob,
      isPrimary: false,
      takenAt: new Date().toISOString(),
    })
    await refresh()
  }

  async function removePhoto(id: string) {
    await deletePhoto(id)
    await refresh()
  }

  return { photos, loading, refresh, addPhotoToPlant, removePhoto }
}
