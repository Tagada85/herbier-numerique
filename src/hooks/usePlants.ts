import { useCallback, useEffect, useState } from 'react'
import {
  getAllPlants,
  getPlantById,
  addPlant,
  updatePlant,
  deletePlant,
  findByScientificName,
} from '../db/plants.db'
import { addPhoto, deletePhotosByPlantId } from '../db/photos.db'
import type { Plant } from '../db/schema'

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const all = await getAllPlants()
    setPlants(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function cataloguePlant(
    plantData: {
      scientificName: string
      commonName: string
      family: string
      genus: string
      plantnetScore: number
      zoneIds: string[]
    },
    imageBlob: Blob,
  ): Promise<{ plant: Plant; isNew: boolean }> {
    const existing = await findByScientificName(plantData.scientificName)

    if (existing) {
      await addPhoto({
        plantId: existing.id,
        blob: imageBlob,
        isPrimary: false,
        takenAt: new Date().toISOString(),
      })
      await refresh()
      return { plant: existing, isNew: false }
    }

    const newPlant = await addPlant({ ...plantData, notes: '' })
    await addPhoto({
      plantId: newPlant.id,
      blob: imageBlob,
      isPrimary: true,
      takenAt: new Date().toISOString(),
    })
    await refresh()
    return { plant: newPlant, isNew: true }
  }

  async function removePlant(id: string) {
    await deletePhotosByPlantId(id)
    await deletePlant(id)
    await refresh()
  }

  return {
    plants,
    loading,
    refresh,
    cataloguePlant,
    removePlant,
    getPlantById,
    updatePlant,
  }
}
