import { Group, Text, Anchor, Burger } from '@mantine/core'
import { IconHeart } from '@tabler/icons-react'
import mapLogo from '../assets/map.png'

interface HeaderProps {
  opened: boolean
  toggle: () => void
}

const Header = ({ opened, toggle }: HeaderProps) => {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group gap="sm">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <img src={mapLogo} alt="Event Map Logo" style={{ width: 32, height: 32 }} />
        <Text size="lg" fw={600} c="#00bcd4">
          Event Map
        </Text>
      </Group>

      <Group gap="lg" visibleFrom="sm">
        <Anchor href="#" underline="never" c="dimmed" fw={500}>
          Map
        </Anchor>
        <Anchor href="#" underline="never" c="dimmed" fw={500}>
          Events
        </Anchor>
        <Anchor href="#" underline="never" c="dimmed" fw={500}>
          About
        </Anchor>
        <Group gap={4}>
          <IconHeart size={16} color="#666" />
          <Anchor href="#" underline="never" c="dimmed" fw={500}>
            Tracked
          </Anchor>
        </Group>
      </Group>
    </Group>
  )
}

export default Header
