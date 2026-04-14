import { getDB, type Activity } from './schema'

export async function getAllActivities(): Promise<Activity[]> {
  const db = await getDB()
  const all = await db.getAll('activities')
  return all.sort((a, b) => b.date.localeCompare(a.date))
}

export async function addActivity(
  input: Omit<Activity, 'id' | 'createdAt'>,
): Promise<Activity> {
  const db = await getDB()
  const activity: Activity = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await db.add('activities', activity)
  return activity
}

export async function deleteActivity(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('activities', id)
}
