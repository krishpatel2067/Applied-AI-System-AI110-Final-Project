/**
 * src/hooks/usePets.js
 * --------------------
 * Fetches the pet list on mount and exposes addPet / deletePet actions that
 * each refresh the list automatically after the API call succeeds.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getPets,
  createPet as apiCreatePet,
  deletePet as apiDeletePet,
} from '@/api/client'

export function usePets() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPets(await getPets())
    } catch (err) {
      setError(err.message)
      console.error('[usePets] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refetch() }, [refetch])

  const addPet = async (data) => {
    await apiCreatePet(data)
    await refetch()
  }

  const deletePet = async (petId) => {
    await apiDeletePet(petId)
    await refetch()
  }

  return { pets, loading, error, addPet, deletePet, refetch }
}
