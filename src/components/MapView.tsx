import { useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Box } from '@mantine/core'
import L from 'leaflet'
import type { OutageData } from '../types/outage'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapViewProps {
  outages?: OutageData[]
}

const MapView = ({ outages = [] }: MapViewProps) => {
  const mapRef = useRef<L.Map>(null)

  // Sample outage data for New Zealand
  const sampleOutages: OutageData[] = [
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
    },
    {
      id: '2',
      title: 'Internet Outage - Wellington',
      description: 'Fiber cable damage affecting Wellington region',
      latitude: -41.2924,
      longitude: 174.7787,
      severity: 'medium',
      status: 'active',
      affectedCustomers: 1800,
      estimatedRestoration: new Date('2024-01-15T16:00:00Z'),
      createdAt: new Date('2024-01-15T09:15:00Z'),
    },
    {
      id: '3',
      title: 'Water Supply Issue - Christchurch',
      description: 'Water treatment plant maintenance affecting supply',
      latitude: -43.5321,
      longitude: 172.6362,
      severity: 'medium',
      status: 'active',
      affectedCustomers: 3200,
      estimatedRestoration: new Date('2024-01-15T20:00:00Z'),
      createdAt: new Date('2024-01-15T08:00:00Z'),
    },
    {
      id: '4',
      title: 'Power Outage - Hamilton',
      description: 'Transformer failure in residential area',
      latitude: -37.7870,
      longitude: 175.2793,
      severity: 'low',
      status: 'resolved',
      affectedCustomers: 450,
      estimatedRestoration: new Date('2024-01-15T14:00:00Z'),
      createdAt: new Date('2024-01-15T11:30:00Z'),
    },
    {
      id: '5',
      title: 'Gas Supply Disruption - Dunedin',
      description: 'Pipeline maintenance affecting gas supply',
      latitude: -45.8788,
      longitude: 170.5028,
      severity: 'low',
      status: 'active',
      affectedCustomers: 680,
      estimatedRestoration: new Date('2024-01-15T17:30:00Z'),
      createdAt: new Date('2024-01-15T07:45:00Z'),
    },
  ]

  const displayOutages = outages.length > 0 ? outages : sampleOutages

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ff4757'
      case 'medium':
        return '#ffa502'
      case 'low':
        return '#2ed573'
      default:
        return '#747d8c'
    }
  }

  const createCustomIcon = (severity: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${getSeverityColor(severity)};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
  }

  return (
    <Box style={{ height: 'calc(100vh - 120px)', width: '100%' }}>
      <MapContainer
        center={[-41.2924, 174.7787]} // Wellington, New Zealand
        zoom={6} // Zoom level to show most of New Zealand
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {displayOutages.map((outage) => (
          <Marker
            key={outage.id}
            position={[outage.latitude, outage.longitude]}
            icon={createCustomIcon(outage.severity)}
          >
            <Popup>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                  {outage.title}
                </h3>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>
                  {outage.description}
                </p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>
                  <strong>Status:</strong> {outage.status}
                </p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>
                  <strong>Affected:</strong> {outage.affectedCustomers} customers
                </p>
                {outage.estimatedRestoration && (
                  <p style={{ margin: '4px 0', fontSize: '12px' }}>
                    <strong>Est. Restoration:</strong>{' '}
                    {outage.estimatedRestoration.toLocaleString()}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  )
}

export default MapView
