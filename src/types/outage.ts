export interface OutageData {
  id: string
  title: string
  description: string
  latitude: number
  longitude: number
  severity: 'low' | 'medium' | 'high'
  status: 'active' | 'resolved' | 'investigating'
  affectedCustomers: number
  estimatedRestoration?: Date
  createdAt: Date
  updatedAt?: Date
  outageType?: 'power' | 'water' | 'gas' | 'internet' | 'other'
  provider?: string
  region?: string
}

export interface OutageStats {
  total: number
  active: number
  resolved: number
  investigating: number
  affectedCustomers: number
}

export interface OutageFilters {
  severity?: string[]
  status?: string[]
  outageType?: string[]
  region?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}