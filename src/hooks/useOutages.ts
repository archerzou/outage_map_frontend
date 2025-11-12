import { useState, useEffect } from 'react'
import type { OutageData, OutageFilters } from '../types/outage'
import { OutageService } from '../utils/database'

export const useOutages = () => {
  const [outages, setOutages] = useState<OutageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOutages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await OutageService.getAllOutages()
      setOutages(data)
    } catch (err) {
      setError('Failed to fetch outages')
      console.error('Error fetching outages:', err)
    } finally {
      setLoading(false)
    }
  }

  const createOutage = async (outageData: Omit<OutageData, 'id' | 'createdAt'>) => {
    try {
      const newOutage = await OutageService.createOutage(outageData)
      if (newOutage) {
        setOutages(prev => [newOutage, ...prev])
        return newOutage
      }
      throw new Error('Failed to create outage')
    } catch (err) {
      setError('Failed to create outage')
      console.error('Error creating outage:', err)
      return null
    }
  }

  const updateOutage = async (id: string, updates: Partial<OutageData>) => {
    try {
      const updatedOutage = await OutageService.updateOutage(id, updates)
      if (updatedOutage) {
        setOutages(prev =>
          prev.map(outage =>
            outage.id === id ? updatedOutage : outage
          )
        )
        return updatedOutage
      }
      throw new Error('Failed to update outage')
    } catch (err) {
      setError('Failed to update outage')
      console.error('Error updating outage:', err)
      return null
    }
  }

  const deleteOutage = async (id: string) => {
    try {
      const success = await OutageService.deleteOutage(id)
      if (success) {
        setOutages(prev => prev.filter(outage => outage.id !== id))
        return true
      }
      throw new Error('Failed to delete outage')
    } catch (err) {
      setError('Failed to delete outage')
      console.error('Error deleting outage:', err)
      return false
    }
  }

  const filterOutages = (filters: OutageFilters) => {
    return outages.filter(outage => {
      if (filters.severity && !filters.severity.includes(outage.severity)) {
        return false
      }
      if (filters.status && !filters.status.includes(outage.status)) {
        return false
      }
      if (filters.outageType && outage.outageType && !filters.outageType.includes(outage.outageType)) {
        return false
      }
      if (filters.region && outage.region && !filters.region.includes(outage.region)) {
        return false
      }
      if (filters.dateRange) {
        const outageDate = new Date(outage.createdAt)
        if (outageDate < filters.dateRange.start || outageDate > filters.dateRange.end) {
          return false
        }
      }
      return true
    })
  }

  const getOutageStats = () => {
    const total = outages.length
    const active = outages.filter(o => o.status === 'active').length
    const resolved = outages.filter(o => o.status === 'resolved').length
    const investigating = outages.filter(o => o.status === 'investigating').length
    const affectedCustomers = outages.reduce((sum, o) => sum + o.affectedCustomers, 0)

    return {
      total,
      active,
      resolved,
      investigating,
      affectedCustomers,
    }
  }

  useEffect(() => {
    fetchOutages()
  }, [])

  return {
    outages,
    loading,
    error,
    fetchOutages,
    createOutage,
    updateOutage,
    deleteOutage,
    filterOutages,
    getOutageStats,
  }
}
