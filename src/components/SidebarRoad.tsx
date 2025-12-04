import SidebarLayout from './shared/SidebarLayout'

interface SidebarRoadProps {
  eventTypeName: string
  onBack: () => void
}

const SidebarRoad = ({ eventTypeName, onBack }: SidebarRoadProps) => {

  return (
    <SidebarLayout eventTypeName={eventTypeName} onBack={onBack}>
      <h1>Road</h1>
    </SidebarLayout>
  )
}

export default SidebarRoad
