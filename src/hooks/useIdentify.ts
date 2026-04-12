import { useState } from 'react'
import { identifyPlant } from '../services/plantnet'
import type { IdentificationResult } from '../types/plantnet.types'

interface UseIdentifyState {
  results: IdentificationResult[]
  loading: boolean
  error: string | null
}

export function useIdentify() {
  const [state, setState] = useState<UseIdentifyState>({
    results: [],
    loading: false,
    error: null,
  })

  async function identify(imageFile: File) {
    setState({ results: [], loading: true, error: null })

    try {
      const results = await identifyPlant(imageFile)
      setState({ results, loading: false, error: null })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de l'identification"
      setState({ results: [], loading: false, error: message })
    }
  }

  function reset() {
    setState({ results: [], loading: false, error: null })
  }

  return { ...state, identify, reset }
}
