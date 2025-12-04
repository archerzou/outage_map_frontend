import { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline } from 'react-leaflet'
import { Box } from '@mantine/core'
import L from 'leaflet'
import 'leaflet.markercluster'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import type { RoadClosure } from '../types/road'
import { formatTimeRange } from '../utils/dateFormat'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapViewRoadProps {
  roadClosures?: RoadClosure[]
  selectedRoadId?: string | null
}

const MapViewRoad = ({ roadClosures = [], selectedRoadId = null }: MapViewRoadProps) => {
  const mapRef = useRef<L.Map>(null)

  const createClusterCustomIcon = (cluster: L.MarkerCluster) => {
    const count = cluster.getChildCount()
    
    return L.divIcon({
      html: `<div style="
        background-color: #ffa502;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        color: white;
      ">${count}</div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(40, 40, true),
    })
  }

  const getMarkerIcon = (isSelected: boolean) => {
    const backgroundColor = isSelected ? '#00bcd4' : 'white'
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${backgroundColor};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      ">🚧</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })
  }

  const getRoadClosureCenter = (closure: RoadClosure): [number, number] => {
    if (closure.location_geometry.type === 'Point') {
      const coords = closure.location_geometry.coordinates as [number, number]
      return [coords[1], coords[0]]
    } else {
      const multiLineCoords = closure.location_geometry.coordinates as [number, number][][]
      const allPoints = multiLineCoords.flat()
      const lats = allPoints.map(coord => coord[1])
      const lngs = allPoints.map(coord => coord[0])
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
      return [centerLat, centerLng]
    }
  }

  const getImpactColor = (impact: string): string => {
    switch (impact.toLowerCase()) {
      case 'road closed':
        return '#ff4757'
      case 'caution':
        return '#ffa502'
      case 'delays':
        return '#ff6b6b'
      default:
        return '#ffa502'
    }
  }

  const renderPopupContent = (closure: RoadClosure) => (
    <div style={{ cursor: 'pointer', minWidth: '200px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>
        {closure.location_description}
      </h3>
      <p style={{ margin: '4px 0', fontSize: '12px' }}>
        <strong>Status:</strong>{' '}
        <span style={{ 
          fontWeight: 600,
          textTransform: 'capitalize'
        }}>
          {closure.status}
        </span>
      </p>
      <p style={{ margin: '4px 0', fontSize: '12px' }}>
        <strong>Impact:</strong>{' '}
        <span style={{ 
          fontWeight: 600,
          color: getImpactColor(closure.impact)
        }}>
          {closure.impact}
        </span>
      </p>
      <p style={{ margin: '4px 0', fontSize: '12px' }}>
        <strong>Time:</strong> {formatTimeRange(closure.start_time, closure.end_time)}
      </p>
      <p style={{ margin: '4px 0', fontSize: '12px' }}>
        <strong>Type:</strong> {closure.schedule_type === 'planned' ? 'Planned' : 'Unplanned'}
      </p>
      {closure.description && (
        <p style={{ margin: '4px 0', fontSize: '12px' }}>
          <strong>Description:</strong> {closure.description}
        </p>
      )}
      {closure.detour_description && closure.detour_description !== 'Not Applicable' && (
        <p style={{ margin: '4px 0', fontSize: '12px' }}>
          <strong>Detour:</strong> {closure.detour_description}
        </p>
      )}
    </div>
  )

  useEffect(() => {
    if (mapRef.current && selectedRoadId) {
      const selectedClosure = roadClosures.find(c => c.id === selectedRoadId)
      if (selectedClosure) {
        const center = getRoadClosureCenter(selectedClosure)
        mapRef.current.setView(center, 13, { animate: true })
      }
    }
  }, [selectedRoadId, roadClosures])

  const pointClosures = roadClosures.filter(closure => closure.location_geometry.type === 'Point')
  const lineClosures = roadClosures.filter(closure => closure.location_geometry.type === 'MultiLineString')

  return (
    <Box style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
      <MapContainer
        center={[-41.2865, 174.7762]} // Wellington, New Zealand - central location for road closures
        zoom={6} // Country-wide view for New Zealand
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        zoomControl={false}
        attributionControl={false}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={80}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
        >
          {pointClosures.map((closure) => {
            const isSelected = closure.id === selectedRoadId
            const coords = closure.location_geometry.coordinates as [number, number]
            
            return (
              <Marker
                key={closure.id}
                position={[coords[1], coords[0]]}
                icon={getMarkerIcon(isSelected)}
              >
                <Popup>
                  {renderPopupContent(closure)}
                </Popup>
              </Marker>
            )
          })}
        </MarkerClusterGroup>

        {lineClosures.map((closure) => {
          const isSelected = closure.id === selectedRoadId
          const multiLineCoords = closure.location_geometry.coordinates as [number, number][][]
          const lineColor = isSelected ? '#00bcd4' : getImpactColor(closure.impact)
          
          return multiLineCoords.map((lineCoords, lineIndex) => {
            const positions = lineCoords.map(coord => [coord[1], coord[0]] as [number, number])
            
            return (
              <Polyline
                key={`${closure.id}-line-${lineIndex}`}
                positions={positions}
                pathOptions={{
                  color: lineColor,
                  weight: isSelected ? 6 : 4,
                  opacity: isSelected ? 1 : 0.8,
                }}
              >
                <Popup>
                  {renderPopupContent(closure)}
                </Popup>
              </Polyline>
            )
          })
        })}
      </MapContainer>
    </Box>
  )
}

export default MapViewRoad
