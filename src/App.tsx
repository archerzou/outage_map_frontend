import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import MapView from './components/MapView'
import Header from './components/Header'
import SidebarHome from './components/SidebarHome'
import SidebarDetail from './components/SidebarDetail'
import { eventTypes } from './data/eventTypes'
import { powerOutagesData } from './data/powerOutages'
import type { Outage } from './types/outage'

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

  const getEventData = (): Outage[] => {
    if (selectedEventType === 'power-outages') {
      return powerOutagesData
    }
    return []
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
