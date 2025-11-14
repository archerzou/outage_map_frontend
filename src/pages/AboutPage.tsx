import { Container, Title, Text, Stack } from '@mantine/core'

const AboutPage = () => {
  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Title order={1}>About Event Map</Title>
        <Text size="lg">
          Event Map is a comprehensive platform for tracking and visualizing various events
          across the Canterbury region, including power outages, road closures, school closures,
          and boil water notices.
        </Text>
        <Text>
          Our mission is to provide real-time information to help communities stay informed
          and prepared for service disruptions and important events in their area.
        </Text>
      </Stack>
    </Container>
  )
}

export default AboutPage
