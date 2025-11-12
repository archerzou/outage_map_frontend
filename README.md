# New Zealand Outage Map

A React-based interactive map application for tracking and visualizing service outages across New Zealand. Built with Vite, TypeScript, Mantine UI, Leaflet, and Neon PostgreSQL.

## Features

- 🗺️ Interactive map focused on New Zealand
- 📍 Real-time outage markers with severity indicators
- 🎛️ Filtering and search functionality
- 📊 Dashboard with outage statistics
- 🏢 Support for multiple service types (Power, Water, Gas, Internet)
- 📱 Responsive design with mobile support
- 🔄 Real-time updates
- 🗄️ PostgreSQL database integration with Neon

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Mantine UI
- **Maps**: Leaflet + React Leaflet
- **Database**: Neon PostgreSQL
- **Styling**: CSS Modules + Mantine
- **Icons**: Tabler Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL database (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd outage_map_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your Neon database URL in `.env`:
```env
VITE_DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

5. Start the development server:
```bash
npm run dev
```

### Database Setup

The application will automatically create the required database tables on first run. You can also manually run the table creation by importing and calling `createOutagesTable()` from `src/utils/database.ts`.

## Project Structure

```
src/
├── components/          # React components
│   ├── MapView.tsx     # Main map component
│   └── Sidebar.tsx     # Dashboard sidebar
├── hooks/              # Custom React hooks
│   └── useOutages.ts   # Outage data management
├── types/              # TypeScript type definitions
│   └── outage.ts       # Outage-related types
├── utils/              # Utility functions
│   └── database.ts     # Database service layer
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Usage

### Adding New Outages

Outages can be added through the database service or by extending the UI with a form component.

### Filtering Outages

Use the sidebar filters to:
- Search by title/description
- Filter by severity (High, Medium, Low)
- Filter by status (Active, Resolved, Investigating)
- Filter by service type

### Map Interaction

- Click markers to view outage details
- Zoom and pan to explore different regions
- Markers are color-coded by severity:
  - 🔴 Red: High severity
  - 🟠 Orange: Medium severity
  - 🟢 Green: Low severity

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Create components in `src/components/`
2. Add types in `src/types/`
3. Use the `useOutages` hook for data management
4. Follow the existing code structure and conventions

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

3. Ensure environment variables are configured in your deployment environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
