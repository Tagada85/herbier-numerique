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

export interface Activity {
  id: string
  typeId: string
  notes: string
  plantId: string | null
  zoneId: string | null
  date: string
  createdAt: string
}

export interface ActivityType {
  id: string
  label: string
  isCustom: boolean
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
  activities: {
    key: string
    value: Activity
    indexes: {
      'by-plant-id': string
      'by-zone-id': string
      'by-date': string
    }
  }
  activityTypes: {
    key: string
    value: ActivityType
  }
}

const DB_NAME = 'herbier-db'
const DB_VERSION = 2

const PREDEFINED_ACTIVITY_TYPES: ActivityType[] = [
  { id: 'predef-semis', label: 'Semis', isCustom: false },
  { id: 'predef-arrosage', label: 'Arrosage', isCustom: false },
  { id: 'predef-rempotage', label: 'Rempotage', isCustom: false },
  { id: 'predef-taille', label: 'Taille', isCustom: false },
  { id: 'predef-recolte', label: 'Récolte', isCustom: false },
  { id: 'predef-prep-sol', label: 'Préparation du sol', isCustom: false },
  { id: 'predef-desherbage', label: 'Désherbage', isCustom: false },
  { id: 'predef-fertilisation', label: 'Fertilisation', isCustom: false },
  { id: 'predef-traitement', label: 'Traitement', isCustom: false },
  { id: 'predef-paillage', label: 'Paillage', isCustom: false },
  { id: 'predef-plantation', label: 'Plantation', isCustom: false },
  { id: 'predef-bouturage', label: 'Bouturage', isCustom: false },
  { id: 'predef-observation', label: 'Observation', isCustom: false },
]

let dbInstance: IDBPDatabase<HerbierDB> | null = null

export async function getDB(): Promise<IDBPDatabase<HerbierDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<HerbierDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, _newVersion, transaction) {
      if (oldVersion < 1) {
        const plantStore = db.createObjectStore('plants', { keyPath: 'id' })
        plantStore.createIndex('by-scientific-name', 'scientificName', {
          unique: true,
        })

        const photoStore = db.createObjectStore('photos', { keyPath: 'id' })
        photoStore.createIndex('by-plant-id', 'plantId', { unique: false })

        db.createObjectStore('zones', { keyPath: 'id' })
      }

      if (oldVersion < 2) {
        const activityStore = db.createObjectStore('activities', {
          keyPath: 'id',
        })
        activityStore.createIndex('by-plant-id', 'plantId', { unique: false })
        activityStore.createIndex('by-zone-id', 'zoneId', { unique: false })
        activityStore.createIndex('by-date', 'date', { unique: false })

        db.createObjectStore('activityTypes', { keyPath: 'id' })

        const typesStore = transaction.objectStore('activityTypes')
        for (const type of PREDEFINED_ACTIVITY_TYPES) {
          typesStore.put(type)
        }
      }
    },
  })

  return dbInstance
}
