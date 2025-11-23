import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import MapView from './components/MapView'
import HazardsView from './components/HazardsView'
import Header from './components/Header'
import Sidebar from './components/Sidebar.tsx'
import SidebarOutages from './components/SidebarOutages.tsx'
import SidebarRoad from './components/SidebarRoad.tsx'
import SidebarWeather from './components/SidebarWeather.tsx'
import { eventTypes } from './data/eventTypes'
import powerOutagesData from './data/powerOutages.json'
import weatherEventsData from './data/historicWeatherHazards.json'
import type { Outage } from './types/outage'
import type { WeatherEvent, Hazard } from './types/weather'

function App() {
  const [opened, { toggle }] = useDisclosure()
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null)
  const [selectedOutageId, setSelectedOutageId] = useState<string | null>(null)
  const [selectedWeatherEventId, setSelectedWeatherEventId] = useState<number | null>(null)
  const [showAllWeatherHazards, setShowAllWeatherHazards] = useState<boolean>(true)

  const handleSelectEventType = (eventTypeId: string) => {
    setSelectedEventType(eventTypeId)
    setSelectedOutageId(null)
    setSelectedWeatherEventId(null)
    setShowAllWeatherHazards(true)
  }

  const handleBack = () => {
    setSelectedEventType(null)
    setSelectedOutageId(null)
    setSelectedWeatherEventId(null)
    setShowAllWeatherHazards(true)
  }

  const handleOutageSelect = (outageId: string) => {
    setSelectedOutageId(outageId)
  }

  const handleWeatherEventSelect = (eventId: number) => {
    setSelectedWeatherEventId(eventId)
    setShowAllWeatherHazards(false)
  }

  const handleShowAllWeatherHazards = () => {
    setSelectedWeatherEventId(null)
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
          />
        )
      case 'road-closures':
        return (
          <SidebarRoad
            eventTypeName={getEventTypeName(selectedEventType)}
            onBack={handleBack}
          />
        )
      case 'historic-weather-hazards':
        return (
          <SidebarWeather
            eventTypeName={getEventTypeName(selectedEventType)}
            onBack={handleBack}
            onEventSelect={handleWeatherEventSelect}
            onShowAllHazards={handleShowAllWeatherHazards}
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
          selectedHazardId={null}
          eventTitle={getSelectedEventTitle()}
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
