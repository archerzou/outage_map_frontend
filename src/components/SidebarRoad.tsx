import { Card, Text, TextInput, Button, Stack, Checkbox } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'
import { useState } from 'react'
import SidebarLayout from './shared/SidebarLayout'

interface SidebarRoadProps {
  eventTypeName: string
  onBack: () => void
}

const SidebarRoad = ({ eventTypeName, onBack }: SidebarRoadProps) => {
  const [locationSearch, setLocationSearch] = useState('Christchurch, New Zealand')

  return (
    <SidebarLayout eventTypeName={eventTypeName} onBack={onBack}>
      <Card withBorder>
        <Stack gap="sm">
          <Text size="sm" fw={600}>Enter a location:</Text>

          <TextInput
            value={locationSearch}
            onChange={(event) => setLocationSearch(event.currentTarget.value)}
            rightSection={<IconMapPin size={16} />}
          />

          <Button fullWidth color="yellow" style={{ color: '#000' }}>
            Find
          </Button>
        </Stack>
      </Card>

      <Card withBorder>
        <Stack gap="sm">
          <Text size="sm" fw={600}>Options</Text>

          <Checkbox label="Incidents" defaultChecked />
          <Checkbox label="Roadworks" defaultChecked />
          <Checkbox label="Congestion" defaultChecked />
          <Checkbox label="Road closures" defaultChecked />
          <Checkbox label="Lane closed" defaultChecked />
          <Checkbox label="Weather incidents" defaultChecked />
        </Stack>
      </Card>
    </SidebarLayout>
  )
}

export default SidebarRoad
