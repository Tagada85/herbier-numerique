import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export interface Plant {
  id: string
  scientificName: string
  commonName: string
  family: string
  genus: string
  plantnetScore: number
  notes: string
  zoneIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Photo {
  id: string
  plantId: string
  blob: Blob
  isPrimary: boolean
  takenAt: string
  createdAt: string
}

export interface Zone {
  id: string
  name: string
  description: string
  createdAt: string
}

interface HerbierDB extends DBSchema {
  plants: {
    key: string
    value: Plant
    indexes: { 'by-scientific-name': string }
  }
  photos: {
    key: string
    value: Photo
    indexes: { 'by-plant-id': string }
  }
  zones: {
    key: string
    value: Zone
  }
}

const DB_NAME = 'herbier-db'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<HerbierDB> | null = null

export async function getDB(): Promise<IDBPDatabase<HerbierDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<HerbierDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const plantStore = db.createObjectStore('plants', { keyPath: 'id' })
      plantStore.createIndex('by-scientific-name', 'scientificName', {
        unique: true,
      })

      const photoStore = db.createObjectStore('photos', { keyPath: 'id' })
      photoStore.createIndex('by-plant-id', 'plantId', { unique: false })

      db.createObjectStore('zones', { keyPath: 'id' })
    },
  })

  return dbInstance
}
