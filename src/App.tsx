import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import MapView from './components/MapView'
import Header from './components/Header'
import SidebarHome from './components/SidebarHome'
import SidebarDetail from './components/SidebarDetail'
import { eventTypes } from './data/eventTypes'
import { powerOutagesData } from './data/powerOutages'
import { roadClosuresData } from './data/roadClosures'

function App() {
  const [opened, { toggle }] = useDisclosure()
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null)

  const handleSelectEventType = (eventTypeId: string) => {
    setSelectedEventType(eventTypeId)
  }

  const handleBack = () => {
    setSelectedEventType(null)
  }

  const getEventTypeName = (eventTypeId: string) => {
    const eventType = eventTypes.find(et => et.id === eventTypeId)
    return eventType?.name || ''
  }

  const getEventData = () => {
    switch (selectedEventType) {
      case 'power-outages':
        return powerOutagesData.map(outage => ({
          id: outage.id,
          title: outage.title,
          description: outage.description,
          latitude: outage.latitude,
          longitude: outage.longitude,
          severity: outage.severity,
          status: outage.status,
          affectedCustomers: outage.affectedCustomers,
          estimatedRestoration: outage.estimatedRestoration,
          createdAt: outage.createdAt,
        }))
      case 'road-closures':
        return roadClosuresData.map(closure => ({
          id: closure.id,
          title: closure.title,
          description: closure.description,
          latitude: closure.latitude,
          longitude: closure.longitude,
          severity: closure.severity,
          status: closure.status,
          affectedCustomers: 0,
          createdAt: closure.createdAt,
        }))
      default:
        return []
    }
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
        {selectedEventType ? (
          <SidebarDetail
            eventTypeId={selectedEventType}
            eventTypeName={getEventTypeName(selectedEventType)}
            onBack={handleBack}
          />
        ) : (
          <SidebarHome onSelectEventType={handleSelectEventType} />
        )}
      </AppShell.Navbar>

      <AppShell.Main style={{ padding: 0, position: 'relative', height: 'calc(100dvh - 60px)', zIndex: 0 }}>
        <MapView outages={getEventData()} />
      </AppShell.Main>
    </AppShell>
  )
}

export default App
