import type {
  PlantNetResponse,
  IdentificationResult,
} from '../types/plantnet.types'

const API_URL = 'https://my-api.plantnet.org/v2/identify/all'
const API_KEY = import.meta.env.VITE_PLANTNET_API_KEY as string

export async function identifyPlant(
  imageFile: File,
): Promise<IdentificationResult[]> {
  const form = new FormData()
  form.append('organs', 'auto')
  form.append('images', imageFile)

  const url = new URL(API_URL)
  url.searchParams.append('include-related-images', 'true')
  url.searchParams.append('lang', navigator.language.split('-')[0] || 'fr')
  url.searchParams.append('api-key', API_KEY)

  const response = await fetch(url.toString(), {
    method: 'POST',
    body: form,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erreur PlantNet (${response.status}): ${errorText}`)
  }

  const data: PlantNetResponse = await response.json()

  return data.results.map((result) => ({
    scientificName: result.species.scientificNameWithoutAuthor,
    commonName: result.species.commonNames[0] ?? '',
    family: result.species.family.scientificName,
    genus: result.species.genus.scientificName,
    score: result.score,
    images: result.images.slice(0, 3).map((img) => ({
      url: img.url.m,
      alt: `${img.citation} - ${img.date.string}`,
    })),
    gbifUrl: result.gbif
      ? `https://www.gbif.org/species/${result.gbif.id}`
      : null,
  }))
}
