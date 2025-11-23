import { Stack, Title, Button, Card, Text, Badge, Group, Select, TextInput, Checkbox, Skeleton, ActionIcon } from '@mantine/core'
import { IconArrowLeft, IconSearch, IconMapPin, IconAlertCircle, IconChevronRight, IconX, IconFilter } from '@tabler/icons-react'
import { useState, useMemo } from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import powerOutagesDataJson from '../data/powerOutages.json'
import type { Outage } from '../types/outage'

const powerOutagesData = powerOutagesDataJson as Outage[]

interface SidebarDetailProps {
  eventTypeId: string
  eventTypeName: string
  onBack: () => void
  onOutageSelect?: (outageId: string) => void
}

const SidebarDetail = ({ eventTypeId, eventTypeName, onBack, onOutageSelect }: SidebarDetailProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading] = useState(false)
  const [locationSearch, setLocationSearch] = useState('Christchurch, New Zealand')

  const [debouncedSearch] = useDebouncedValue(searchTerm, 300)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'red'
      case 'restored':
        return 'green'
      case 'cancelled':
        return 'gray'
      case 'postponed':
        return 'yellow'
      case 'scheduled':
        return 'blue'
      default:
        return 'gray'
    }
  }

  const displayOutages = useMemo(() => {
    const term = debouncedSearch.toLowerCase().trim()
    return powerOutagesData.filter(outage => {
      const matchesSearch = term === '' || 
        outage.location_description.toLowerCase().includes(term)
      
      const matchesStatus = statusFilter === 'all' || 
        outage.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [debouncedSearch, statusFilter])

  const outagesToShow = displayOutages.slice(0, 8)

  const renderPowerOutagesContent = () => {
    return (
      <>
        <Card withBorder>
          <Stack gap="sm">
            <Text size="sm" fw={600}>Search & Filter</Text>

            <TextInput
              placeholder="Search by location..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              rightSection={
                searchTerm ? (
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    aria-label="Clear search"
                    onClick={() => setSearchTerm('')}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                ) : null
              }
              rightSectionPointerEvents="auto"
            />

            <Select
              placeholder="Filter by Status"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'restored', label: 'Restored' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'postponed', label: 'Postponed' },
                { value: 'scheduled', label: 'Scheduled' },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || 'all')}
              comboboxProps={{ withinPortal: true, zIndex: 5000 }}
            />
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="sm">
            <Text size="sm" fw={600}>Recent Outages</Text>

            {isLoading ? (
              <Stack gap="md">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} height={120} radius="md" />
                ))}
              </Stack>
            ) : displayOutages.length === 0 ? (
              <Stack align="center" gap="md" py="xl">
                <IconAlertCircle size={48} color="gray" />
                <Text size="lg" fw={500}>No outages found</Text>
                <Text size="sm" c="dimmed" ta="center">
                  Try adjusting your search or filters
                </Text>
              </Stack>
            ) : (
              <>
                {outagesToShow.map((outage) => (
                  <Card 
                    key={outage.id} 
                    withBorder 
                    radius="sm" 
                    p="sm"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onOutageSelect?.(outage.id)}
                  >
                    <Stack gap="xs">
                      <Group justify="space-between" align="flex-start">
                        <Text size="xs" fw={500} lineClamp={1} style={{ flex: 1 }}>
                          {outage.location_description}
                        </Text>
                        <Badge size="xs" color={getStatusColor(outage.status)}>
                          {outage.status}
                        </Badge>
                      </Group>
                      
                      <Text size="xs" c="dimmed">
                        Provider: {outage.provider.toUpperCase()}
                      </Text>
                    </Stack>
                  </Card>
                ))}
                
                <Button 
                  variant="outline" 
                  fullWidth 
                  mt="md"
                  rightSection={<IconChevronRight size={16} />}
                >
                  View All Events
                </Button>
              </>
            )}
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
