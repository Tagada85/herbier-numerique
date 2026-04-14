import { getDB, type ActivityType } from './schema'

export async function getAllActivityTypes(): Promise<ActivityType[]> {
  const db = await getDB()
  const all = await db.getAll('activityTypes')
  return all.sort((a, b) => a.label.localeCompare(b.label, 'fr'))
}
