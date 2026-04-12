export interface PlantNetImage {
  url: {
    o: string
    m: string
    s: string
  }
  citation: string
  date: {
    timestamp: number
    string: string
  }
}

export interface PlantNetResult {
  score: number
  species: {
    scientificNameWithoutAuthor: string
    scientificNameAuthorship: string
    scientificName: string
    commonNames: string[]
    family: {
      scientificName: string
    }
    genus: {
      scientificName: string
    }
  }
  images: PlantNetImage[]
  gbif: {
    id: string
  }
}

export interface PlantNetResponse {
  results: PlantNetResult[]
}

export interface PlantNetError {
  statusCode: number
  error: string
  message: string
}

export interface IdentificationResult {
  scientificName: string
  commonName: string
  family: string
  genus: string
  score: number
  images: { url: string; alt: string }[]
  gbifUrl: string | null
}
