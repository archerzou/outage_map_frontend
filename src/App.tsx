import { AppShell, Burger, Group, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconMapPin } from '@tabler/icons-react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'

function App() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group>
            <IconMapPin size={24} />
            <Title order={3}>Outage Map</Title>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <MapView />
      </AppShell.Main>
    </AppShell>
  )
}

export default App
