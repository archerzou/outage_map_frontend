import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import MapView from './components/MapView'
import MapViewRoad from './components/MapViewRoad'
import HazardsView from './components/HazardsView'
import Header from './components/Header'
import Sidebar from './components/Sidebar.tsx'
import SidebarOutages from './components/SidebarOutages.tsx'
import SidebarRoad from './components/SidebarRoad.tsx'
import SidebarWeather from './components/SidebarWeather.tsx'
import { eventTypes } from './data/eventTypes'
import powerOutagesData from './data/powerOutages.json'
import roadClosuresData from './data/roadClosures.json'
import weatherEventsData from './data/historicWeatherHazards.json'
import type { Outage } from './types/outage'
import type { RoadClosure } from './types/road'
import type { WeatherEvent, Hazard } from './types/weather'

function App() {
  const [opened, { toggle }] = useDisclosure()
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null)
  const [selectedOutageId, setSelectedOutageId] = useState<string | null>(null)
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null)
  const [selectedWeatherEventId, setSelectedWeatherEventId] = useState<number | null>(null)
  const [selectedHazardId, setSelectedHazardId] = useState<number | null>(null)
  const [showAllWeatherHazards, setShowAllWeatherHazards] = useState<boolean>(true)

    const handleSelectEventType = (eventTypeId: string) => {
      setSelectedEventType(eventTypeId)
      setSelectedOutageId(null)
      setSelectedRoadId(null)
      setSelectedWeatherEventId(null)
      setSelectedHazardId(null)
      setShowAllWeatherHazards(true)
    }

    const handleBack = () => {
      setSelectedEventType(null)
      setSelectedOutageId(null)
      setSelectedRoadId(null)
      setSelectedWeatherEventId(null)
      setSelectedHazardId(null)
      setShowAllWeatherHazards(true)
    }

    const handleOutageSelect = (outageId: string) => {
      setSelectedOutageId(outageId)
    }

    const handleRoadSelect = (roadId: string) => {
      setSelectedRoadId(roadId)
    }

  const handleWeatherEventSelect = (eventId: number) => {
    setSelectedWeatherEventId(eventId)
    setSelectedHazardId(null)
    setShowAllWeatherHazards(false)
  }

  const handleShowAllWeatherHazards = () => {
    setSelectedWeatherEventId(null)
    setSelectedHazardId(null)
    setShowAllWeatherHazards(true)
  }

  const getEventTypeName = (eventTypeId: string) => {
    const eventType = eventTypes.find(et => et.id === eventTypeId)
    return eventType?.name || ''
  }

    const getEventData = (): Outage[] => {
      if (selectedEventType === 'power-outages') {
        return powerOutagesData as Outage[]
      }
      return []
    }

    const getRoadClosuresData = (): RoadClosure[] => {
      if (selectedEventType === 'road-closures') {
        return roadClosuresData as RoadClosure[]
      }
      return []
    }

  const getWeatherHazardsData = (): Hazard[] => {
    const events = weatherEventsData as WeatherEvent[]
    
    if (selectedWeatherEventId !== null) {
      const selectedEvent = events.find(e => e.id === selectedWeatherEventId)
      if (selectedEvent) {
        return selectedEvent.hazards.filter(h => h.latitude !== null && h.longitude !== null)
      }
    }
    
    if (showAllWeatherHazards) {
      return events.flatMap(event => 
        event.hazards.filter(h => h.latitude !== null && h.longitude !== null)
      )
    }
    
    return []
  }

  const getSelectedEventTitle = (): string | undefined => {
    if (selectedWeatherEventId !== null) {
      const events = weatherEventsData as WeatherEvent[]
      const selectedEvent = events.find(e => e.id === selectedWeatherEventId)
      return selectedEvent?.title
    }
    return undefined
  }

  const renderSidebar = () => {
    if (!selectedEventType) {
      return <Sidebar onSelectEventType={handleSelectEventType} />
    }

    switch (selectedEventType) {
      case 'power-outages':
        return (
          <SidebarOutages
            eventTypeName={getEventTypeName(selectedEventType)}
            onBack={handleBack}
            onOutageSelect={handleOutageSelect}
            selectedOutageId={selectedOutageId}
          />
        )
            case 'road-closures':
              return (
                <SidebarRoad
                  eventTypeName={getEventTypeName(selectedEventType)}
                  onBack={handleBack}
                  onRoadSelect={handleRoadSelect}
                  selectedRoadId={selectedRoadId}
                />
              )
      case 'historic-weather-hazards':
        return (
          <SidebarWeather
            eventTypeName={getEventTypeName(selectedEventType)}
            onBack={handleBack}
            onEventSelect={handleWeatherEventSelect}
            onShowAllHazards={handleShowAllWeatherHazards}
            selectedEventId={selectedWeatherEventId}
          />
        )
      default:
        return <Sidebar onSelectEventType={handleSelectEventType} />
    }
  }

    const renderMapView = () => {
      if (selectedEventType === 'historic-weather-hazards') {
        return (
          <HazardsView 
            hazards={getWeatherHazardsData()} 
            selectedHazardId={selectedHazardId}
            eventTitle={getSelectedEventTitle()}
            onHazardSelect={setSelectedHazardId}
          />
        )
      }

      if (selectedEventType === 'road-closures') {
        return (
          <MapViewRoad 
            roadClosures={getRoadClosuresData()} 
            selectedRoadId={selectedRoadId}
          />
        )
      }
    
      return <MapView outages={getEventData()} selectedOutageId={selectedOutageId} />
    }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 350,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding={0}
    >
      <AppShell.Header style={{ borderBottom: '1px solid #e0e0e0', zIndex: 1000 }}>
        <Header opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ overflowY: 'auto', zIndex: 900 }}>
        {renderSidebar()}
      </AppShell.Navbar>

      <AppShell.Main style={{ padding: 0, position: 'relative', height: 'calc(100dvh - 60px)', zIndex: 0 }}>
        {renderMapView()}
      </AppShell.Main>
    </AppShell>
  )
}

export default App
