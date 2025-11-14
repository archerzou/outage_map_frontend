import { Stack, Title, Button, Card, Text, Badge, Group, Select, TextInput, Checkbox, Skeleton } from '@mantine/core'
import { IconArrowLeft, IconSearch, IconMapPin, IconAlertCircle, IconChevronRight, IconX, IconFilter, IconUsers, IconClock, IconBolt } from '@tabler/icons-react'
import { useState } from 'react'
import { powerOutagesData } from '../data/powerOutages'
import type { Outage } from '../types/outage'
import { formatTimeRange } from '../utils/dateFormat'

interface SidebarDetailProps {
  eventTypeId: string
  eventTypeName: string
  onBack: () => void
}

const SidebarDetail = ({ eventTypeId, eventTypeName, onBack }: SidebarDetailProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [filteredOutages, setFilteredOutages] = useState<Outage[]>([])
  const [showFiltered, setShowFiltered] = useState(false)
  const [isLoading] = useState(false)
  const [locationSearch, setLocationSearch] = useState('Christchurch, New Zealand')

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

  const filterOutages = () => {
    const filtered = powerOutagesData.filter(outage => {
      const matchesSearch = searchTerm === '' || 
        outage.location_description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || 
        outage.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    
    setFilteredOutages(filtered)
    setShowFiltered(true)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setFilteredOutages([])
    setShowFiltered(false)
  }

  const displayOutages = showFiltered ? filteredOutages : powerOutagesData
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
            />

            <Group spacing="sm" mt="md">
              <Button onClick={filterOutages} leftSection={<IconSearch size={16} />}>
                Find
              </Button>
              <Button variant="outline" onClick={handleClearFilters} leftSection={<IconX size={16} />}>
                Clear Filters
              </Button>
            </Group>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="sm">
            <Text size="sm" fw={600}>Recent Outages</Text>

            {isLoading ? (
              <Stack spacing="md">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} height={120} radius="md" />
                ))}
              </Stack>
            ) : displayOutages.length === 0 ? (
              <Stack align="center" spacing="md" py="xl">
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
                  >
                    <Stack gap="xs">
                      <Group justify="space-between" align="flex-start">
                        <Text size="xs" fw={600} lineClamp={1} style={{ flex: 1 }}>
                          Power Outage - {outage.provider.toUpperCase()}
                        </Text>
                        <Badge size="xs" color={getStatusColor(outage.status)}>
                          {outage.status}
                        </Badge>
                      </Group>
                      
                      <Text size="xs" c="dimmed" lineClamp={2}>
                        {outage.location_description.length > 50 
                          ? `${outage.location_description.substring(0, 50)}...` 
                          : outage.location_description}
                      </Text>
                      
                      <Group gap="xs">
                        <IconUsers size={12} />
                        <Text size="xs">
                          {outage.affected_customers !== null 
                            ? `${outage.affected_customers} customers affected` 
                            : 'Affected customers: Unknown'}
                        </Text>
                      </Group>
                      
                      <Group gap="xs">
                        <IconClock size={12} />
                        <Text size="xs">
                          {formatTimeRange(outage.start_time, outage.end_time)}
                        </Text>
                      </Group>
                      
                      <Group gap="xs">
                        <IconBolt size={12} />
                        <Text size="xs">
                          {outage.schedule_type === 'planned' ? 'Planned' : 'Unplanned'}
                        </Text>
                      </Group>
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
