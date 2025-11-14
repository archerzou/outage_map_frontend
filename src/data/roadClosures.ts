export interface RoadClosure {
  id: string
  title: string
  description: string
  latitude: number
  longitude: number
  severity: 'high' | 'medium' | 'low'
  status: 'active' | 'resolved' | 'investigating'
  closureType: 'incident' | 'roadworks' | 'congestion' | 'road-closure' | 'lane-closed' | 'weather-incident'
  estimatedReopening?: Date
  createdAt: Date
  region: string
  affectedRoutes: string[]
}

export const roadClosuresData: RoadClosure[] = [
  {
    id: '1',
    title: 'Road Closure - State Highway 1',
    description: 'Major accident blocking northbound lanes',
    latitude: -43.5321,
    longitude: 172.6362,
    severity: 'high',
    status: 'active',
    closureType: 'incident',
    estimatedReopening: new Date('2024-01-15T15:00:00Z'),
    createdAt: new Date('2024-01-15T12:30:00Z'),
    region: 'Canterbury',
    affectedRoutes: ['SH1 Northbound'],
  },
  {
    id: '2',
    title: 'Roadworks - Bealey Avenue',
    description: 'Water main replacement, single lane open',
    latitude: -43.5205,
    longitude: 172.6244,
    severity: 'medium',
    status: 'active',
    closureType: 'roadworks',
    estimatedReopening: new Date('2024-01-20T17:00:00Z'),
    createdAt: new Date('2024-01-10T08:00:00Z'),
    region: 'Canterbury',
    affectedRoutes: ['Bealey Avenue'],
  },
  {
    id: '3',
    title: 'Lane Closure - Moorhouse Avenue',
    description: 'Construction work, left lane closed',
    latitude: -43.5389,
    longitude: 172.6258,
    severity: 'low',
    status: 'active',
    closureType: 'lane-closed',
    estimatedReopening: new Date('2024-01-15T18:00:00Z'),
    createdAt: new Date('2024-01-15T07:00:00Z'),
    region: 'Canterbury',
    affectedRoutes: ['Moorhouse Avenue Westbound'],
  },
  {
    id: '4',
    title: 'Weather Incident - Summit Road',
    description: 'Ice and snow making road hazardous',
    latitude: -43.5951,
    longitude: 172.6509,
    severity: 'high',
    status: 'active',
    closureType: 'weather-incident',
    createdAt: new Date('2024-01-15T05:00:00Z'),
    region: 'Canterbury',
    affectedRoutes: ['Summit Road'],
  },
  {
    id: '5',
    title: 'Congestion - Riccarton Road',
    description: 'Heavy traffic due to event',
    latitude: -43.5320,
    longitude: 172.6010,
    severity: 'medium',
    status: 'active',
    closureType: 'congestion',
    estimatedReopening: new Date('2024-01-15T16:00:00Z'),
    createdAt: new Date('2024-01-15T13:00:00Z'),
    region: 'Canterbury',
    affectedRoutes: ['Riccarton Road'],
  },
]
