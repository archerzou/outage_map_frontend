import { Stack, Title, Button, Card, Text, Badge, Group, Select, TextInput, Checkbox } from '@mantine/core'
import { IconArrowLeft, IconSearch, IconRefresh, IconMapPin } from '@tabler/icons-react'
import { useState } from 'react'
import { powerOutagesData } from '../data/powerOutages'

interface SidebarDetailProps {
  eventTypeId: string
  eventTypeName: string
  onBack: () => void
}

const SidebarDetail = ({ eventTypeId, eventTypeName, onBack }: SidebarDetailProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [locationSearch, setLocationSearch] = useState('Christchurch, New Zealand')

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'red'
      case 'medium':
        return 'orange'
      case 'low':
        return 'green'
      default:
        return 'gray'
    }
  }

  const renderPowerOutagesContent = () => {
    return (
      <>
        <Card withBorder>
          <Stack gap="sm">
            <Text size="sm" fw={600}>Filters</Text>

            <TextInput
              placeholder="Search outages..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />

            <Select
              placeholder="Filter by severity"
              data={[
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              value={severityFilter}
              onChange={setSeverityFilter}
              clearable
            />

            <Select
              placeholder="Filter by status"
              data={[
                { value: 'active', label: 'Active' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'investigating', label: 'Investigating' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />

            <Button
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={() => {
                setSearchQuery('')
                setSeverityFilter(null)
                setStatusFilter(null)
              }}
            >
              Clear Filters
            </Button>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="sm">
            <Text size="sm" fw={600}>Recent Outages</Text>

            {powerOutagesData.slice(0, 3).map((outage) => (
              <Card key={outage.id} withBorder radius="sm" p="sm">
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="xs" fw={500} lineClamp={2}>
                      {outage.title}
                    </Text>
                    <Badge size="xs" color={getSeverityColor(outage.severity)}>
                      {outage.severity}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Badge size="xs" variant="outline">
                      {outage.status}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      3 hours ago
                    </Text>
                  </Group>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Card>
      </>
    )
  }

  const renderRoadClosuresContent = () => {
    return (
      <>
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
      </>
    )
  }

  const renderComingSoonContent = () => {
    return (
      <Card withBorder>
        <Stack gap="sm" align="center" py="xl">
          <Text size="lg" fw={600} c="dimmed">
            Coming Soon
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {eventTypeName} tracking will be available soon.
          </Text>
        </Stack>
      </Card>
    )
  }

  const renderContent = () => {
    switch (eventTypeId) {
      case 'power-outages':
        return renderPowerOutagesContent()
      case 'road-closures':
        return renderRoadClosuresContent()
      default:
        return renderComingSoonContent()
    }
  }

  return (
    <Stack gap="md">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={onBack}
        style={{ justifyContent: 'flex-start', padding: '8px' }}
        c="#00bcd4"
      >
        All events
      </Button>

      <Title order={4} c="#00bcd4">
        {eventTypeName}
      </Title>

      {renderContent()}
    </Stack>
  )
}

export default SidebarDetail
