import { Stack, Title, Card, Text, Badge, Group, Button, Select, TextInput } from '@mantine/core'
import { IconSearch, IconRefresh } from '@tabler/icons-react'
import { useState } from 'react'

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const outageStats = {
    total: 5,
    active: 4,
    resolved: 1,
    affectedCustomers: 8630,
  }

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

  const recentOutages = [
    {
      id: '1',
      title: 'Power Outage - Auckland CBD',
      severity: 'high',
      status: 'active',
      time: '3 hours ago',
    },
    {
      id: '2',
      title: 'Internet Outage - Wellington',
      severity: 'medium',
      status: 'active',
      time: '4 hours ago',
    },
    {
      id: '3',
      title: 'Water Supply - Christchurch',
      severity: 'medium',
      status: 'active',
      time: '5 hours ago',
    },
  ]

  return (
    <Stack gap="md">
      <Title order={4}>Outage Dashboard</Title>

      {/* Statistics */}
      <Card withBorder>
        <Stack gap="xs">
          <Text size="sm" fw={600}>Current Status</Text>
          <Group justify="space-between">
            <Text size="sm">Total Outages:</Text>
            <Badge color="blue">{outageStats.total}</Badge>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Active:</Text>
            <Badge color="red">{outageStats.active}</Badge>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Resolved:</Text>
            <Badge color="green">{outageStats.resolved}</Badge>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Affected Customers:</Text>
            <Badge color="orange">{outageStats.affectedCustomers.toLocaleString()}</Badge>
          </Group>
        </Stack>
      </Card>

      {/* Filters */}
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

      {/* Recent Outages */}
      <Card withBorder>
        <Stack gap="sm">
          <Text size="sm" fw={600}>Recent Outages</Text>

          {recentOutages.map((outage) => (
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
                    {outage.time}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Card>

      <Button variant="filled" fullWidth>
        Report New Outage
      </Button>
    </Stack>
  )
}

export default Sidebar
