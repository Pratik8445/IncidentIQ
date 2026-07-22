import { useState, useEffect, useCallback } from 'react'

/**
 * Generic data-fetching hook.
 * @param {Function} fetchFn  - async function that returns data
 * @param {Array}    deps     - dependency array (re-fetches when these change)
 * @param {boolean}  skip     - set true to skip fetching (e.g. not authenticated)
 */
export function useFetch(fetchFn, deps = [], skip = false) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    if (skip) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      const status = err?.response?.status
      if (status === 403) {
        setError('Access denied. You do not have permission to view this resource.')
      } else if (status === 401) {
        setError('Session expired. Please log in again.')
      } else {
        setError(err?.response?.data?.message || err?.response?.data?.detail || err?.message || 'Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ...deps])

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}
