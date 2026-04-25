/**
 * src/hooks/useOwner.js
 * ---------------------
 * Manages the owner record: fetches it on mount, exposes createOwner and
 * deleteOwner actions that automatically refresh the local state afterward.
 *
 * owner is null when no owner exists yet (GET /owner returned 404).
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getOwner,
  createOwner as apiCreateOwner,
  deleteOwner as apiDeleteOwner,
} from '@/api/client'

export function useOwner() {
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getOwner()
      setOwner(data)
    } catch (err) {
      // 404 means no owner yet — that is a normal state, not an error
      if (err.message?.includes('404') || err.message?.toLowerCase().includes('no owner')) {
        setOwner(null)
      } else {
        setError(err.message)
        console.error('[useOwner] fetch error:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refetch() }, [refetch])

  const createOwner = async (name) => {
    await apiCreateOwner({ name })
    await refetch()
  }

  const deleteOwner = async () => {
    await apiDeleteOwner()
    await refetch() // will return 404 → sets owner to null → shows OwnerSetup
  }

  return { owner, loading, error, createOwner, deleteOwner, refetch }
}
