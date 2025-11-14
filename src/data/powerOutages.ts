export interface PowerOutage {
  id: string
  title: string
  description: string
  latitude: number
  longitude: number
  severity: 'high' | 'medium' | 'low'
  status: 'active' | 'resolved' | 'investigating'
  affectedCustomers: number
  estimatedRestoration?: Date
  createdAt: Date
  provider: string
  region: string
}

export const powerOutagesData: PowerOutage[] = [
  {
    id: '1',
    title: 'Power Outage - Auckland CBD',
    description: 'Electrical grid failure affecting central Auckland businesses',
    latitude: -36.8485,
    longitude: 174.7633,
    severity: 'high',
    status: 'active',
    affectedCustomers: 2500,
    estimatedRestoration: new Date('2024-01-15T18:00:00Z'),
    createdAt: new Date('2024-01-15T10:30:00Z'),
    provider: 'Vector',
    region: 'Auckland',
  },
  {
    id: '2',
    title: 'Power Outage - Christchurch Central',
    description: 'Transformer failure in central Christchurch',
    latitude: -43.5321,
    longitude: 172.6362,
    severity: 'high',
    status: 'active',
    affectedCustomers: 1800,
    estimatedRestoration: new Date('2024-01-15T16:00:00Z'),
    createdAt: new Date('2024-01-15T09:15:00Z'),
    provider: 'Orion',
    region: 'Canterbury',
  },
  {
    id: '3',
    title: 'Power Outage - Rangiora',
    description: 'Planned maintenance affecting residential areas',
    latitude: -43.3048,
    longitude: 172.5969,
    severity: 'medium',
    status: 'active',
    affectedCustomers: 450,
    estimatedRestoration: new Date('2024-01-15T14:00:00Z'),
    createdAt: new Date('2024-01-15T11:30:00Z'),
    provider: 'Orion',
    region: 'Canterbury',
  },
  {
    id: '4',
    title: 'Power Outage - Ashburton',
    description: 'Storm damage to power lines',
    latitude: -43.8981,
    longitude: 171.7497,
    severity: 'medium',
    status: 'investigating',
    affectedCustomers: 680,
    estimatedRestoration: new Date('2024-01-15T17:30:00Z'),
    createdAt: new Date('2024-01-15T07:45:00Z'),
    provider: 'EA Networks',
    region: 'Canterbury',
  },
  {
    id: '5',
    title: 'Power Outage - Timaru',
    description: 'Equipment failure resolved',
    latitude: -44.3904,
    longitude: 171.2373,
    severity: 'low',
    status: 'resolved',
    affectedCustomers: 320,
    createdAt: new Date('2024-01-15T06:00:00Z'),
    provider: 'Alpine Energy',
    region: 'Canterbury',
  },
]
