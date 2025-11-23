import { Card, Text, Badge, Group, Select, TextInput, Skeleton, ActionIcon, Button, Stack } from '@mantine/core'
import { IconSearch, IconAlertCircle, IconChevronRight, IconX, IconFilter } from '@tabler/icons-react'
import { useState, useMemo } from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import powerOutagesDataJson from '../data/powerOutages.json'
import type { Outage } from '../types/outage'
import SidebarLayout from './shared/SidebarLayout'

const powerOutagesData = powerOutagesDataJson as Outage[]

interface SidebarOutagesProps {
  eventTypeName: string
  onBack: () => void
  onOutageSelect?: (outageId: string) => void
  selectedOutageId?: string | null
}

const SidebarOutages = ({ eventTypeName, onBack, onOutageSelect, selectedOutageId }: SidebarOutagesProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading] = useState(false)

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

  return (
    <SidebarLayout eventTypeName={eventTypeName} onBack={onBack}>
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
              {outagesToShow.map((outage) => {
                const isSelected = outage.id === selectedOutageId
                
                return (
                  <Card 
                    key={outage.id} 
                    withBorder 
                    radius="sm" 
                    p="sm"
                    style={{ 
                      cursor: 'pointer',
                      borderColor: isSelected ? '#00bcd4' : undefined,
                      borderWidth: isSelected ? '2px' : undefined,
                    }}
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
                )
              })}
              
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
    </SidebarLayout>
  )
}

export default SidebarOutages
