import { Container, Title, Text, Stack } from '@mantine/core'

const EventsPage = () => {
  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Title order={1}>All Events</Title>
        <Text>
          View and manage all events across the Canterbury region. This page will display
          a comprehensive list of all active and historical events.
        </Text>
      </Stack>
    </Container>
  )
}

export default EventsPage
