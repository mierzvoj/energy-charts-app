# Energy Charts App

A React TypeScript application for visualizing energy consumption data with interactive charts and telemetry analytics.

## 🚀 Features

- **Interactive Line Charts** - Visualize energy consumption, pricing, and total costs
- **Dynamic Data Granularity** - Switch between daily and monthly views
- **Real-time Data** - Fetch telemetry data from external APIs
- **Responsive Design** - Works seamlessly across devices
- **TypeScript Support** - Full type safety and developer experience

## 📁 Project Structure

```
energy-charts-app/
├── 📂 src/
│   ├── 📂 components/           # React Components
│   │   ├── 🔧 Chart.tsx                    # Base chart component
│   │   ├── 📊 ChartInformation.tsx         # Chart info display
│   │   ├── 🔄 ChartSelector.tsx            # Chart type selector
│   │   ├── ❌ ErrorView.tsx                # Error state component
│   │   ├── 📈 LineTelemetryChart.tsx       # Main line chart (Primary)
│   │   ├── 🚫 NoDataError.tsx              # No data state
│   │   ├── 📊 Components.test.tsx          # Statistics/Chart tests
│   │   └── 📊 StatisticsBarView.tsx        # Statistics component
│   │
│   ├── 📂 context/              # React Context
│   │   └── 🔗 TelemetryProvider.tsx        # Data provider context
│   │
│   ├── 📂 errors/               # Error Handling
│   │   └── 🔧 HttpErrors.ts                # HTTP error utilities
│   │
│   ├── 📂 hooks/                # Custom React Hooks
│   │   └── 📂 utils/
│   │       ├── ❌ ErrorMessageTransformer.ts  # Error message handling
│   │       ├── 🔄 TransformErrors.ts          # Error transformation
│   │       └── 🛠️ ErrorHandler.ts             # Main error handler
│   │
│   ├── 📂 interfaces/           # TypeScript Interfaces
│   │   ├── 📊 ChartData.ts                 # Chart data structure
│   │   ├── ❌ ErrorDisplayProps.ts         # Error display props
│   │   ├── 🎯 PresentationError.ts         # Presentation error types
│   │   ├── 🔗 TelemetryContextType.ts      # Context type definitions
│   │   └── 📡 TelemetryDataset.ts          # Telemetry data structure
│   │
│   ├── 📂 services/             # API Services
│   │   └── 🌐 TelemetryService.ts          # Data fetching service
│   │
│   ├── 📂 types/                # Type Definitions
│   │   ├── 📊 ChartInformationProps.ts     # Chart info props
│   │   ├── 🔄 ChartSelectorProps.ts        # Selector props
│   │   ├── 📅 DateGranularity.ts           # Date granularity enum
│   │   ├── 📊 Statistics.ts                # Statistics types
│   │   └── 📊 StatisticsDisplayProps.ts    # Statistics display props
│   │
│   ├── 🎨 App.css               # Main app styles
│   ├── ⚛️ App.tsx               # Main app component
│   ├── 🎨 index.css             # Global styles
│   ├── ⚛️ index.tsx             # App entry point
│   ├── 🖼️ logo.svg              # App logo
│   ├── ⚡ react-app-env.d.ts    # React app types
│   ├── 📊 reportWebVitals.ts    # Performance monitoring
│   └── 🧪 setupTests.ts         # Test setup configuration
│
├── 📂 public/                   # Static Assets
│   └── 📁 (standard CRA files)
│
├── 🔧 Configuration Files
├── ⚙️ .env                      # Environment variables
├── ⚙️ .env.example              # Environment template
├── ⚙️ .env.local                # Local environment overrides
├── 🚫 .gitignore               # Git ignore rules
├── 🔍 eslint.config.mjs         # ESLint configuration
├── 🧪 jest.config.js            # Jest test configuration
├── 📦 package.json              # Project dependencies
├── 🔒 package-lock.json         # Dependency lock file
└── 📖 README.md                 # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone <repository-url>
cd energy-charts-app
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# .env.local
REACT_APP_API_BASE_URL="an API URL"
```

> **⚠️ Important Notes:**
> - Environment variables in React must start with `REACT_APP_`
> - Never commit `.env.local` to version control
> - Restart the development server after changing environment variables

### 4. Start the development server

```bash
npm start
# or
yarn start
```

The application will open at `http://localhost:3000`

## 🔧 Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Base URL for the telemetry API | `https://api.example.com` |

### Environment Files Priority

1. `.env.local` - Local overrides (not committed)
2. `.env.development` - Development environment
3. `.env.production` - Production environment
4. `.env` - Default values

## 📊 API Integration

The application fetches data from the configured API endpoint:

### Expected API Endpoints

- `GET /timeSeries` - Fetch all telemetry data
- `GET /timeSeries?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&granularity=day` - Fetch filtered data (to be added in the future release)

### Expected Data Format

```typescript
interface TelemetryDataset {
  timestamp: string;    // ISO date string
  consumption: number;  // Energy consumption in kWh
  price: number;       // Price per kWh
}
```

## 🏗️ Architecture

### Key Components

- **TelemetryProvider** - Context provider for managing telemetry data state
- **LineTelemetryChart** - Main chart component with data visualization
- **TelemetryService** - API service for data fetching

### Data Flow

1. `TelemetryProvider` initializes and fetches data using `TelemetryService`
2. Data is stored in React Context and shared across components
3. `LineTelemetryChart` consumes data and renders interactive charts
4. Users can switch between daily/monthly granularity for different views

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

Run tests with coverage:

```bash
npm test -- --coverage
# or
yarn test --coverage
```

## 🏃‍♂️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm test` | Run test suite |
| `npm run build` | Build for production |
| `npm run eject` | Eject from Create React App |

## 📦 Dependencies

### Main Dependencies

- **React** - UI library
- **TypeScript** - Type safety
- **Recharts** - Chart visualization library

### Development Dependencies

- **@testing-library/react** - Testing utilities
- **@types/react** - React TypeScript types

## 🔍 Troubleshooting

### Common Issues

#### 1. "TelemetryService initialized but no data fetched"

**Solution:** Check your environment variables and restart the development server:

```bash
# Check if .env.local exists and has correct values
cat .env.local

# Restart development server
npm start
```

#### 2. CORS Errors

**Solution:** Ensure your API endpoint has proper CORS headers configured:

```javascript
// Backend example
res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
```

#### 3. "Cannot resolve module" errors

**Solution:** Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript errors

**Solution:** Check your TypeScript configuration and ensure all interfaces match your data:

```bash
npx tsc --noEmit
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `build/` directory with optimized production files.

### Environment Variables for Production

Set the production API URL:

```bash
REACT_APP_API_BASE_URL=https://your-production-api.com
```

### Deploy to Static Hosting

The built application can be deployed to:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- Any static hosting service

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Look for similar issues in the project's issue tracker
3. Create a new issue with detailed information about the problem

## 🔮 Future Enhancements

- [ ] Add data export functionality
- [ ] Implement real-time data streaming
- [ ] Add more chart types (bar, pie, area)
- [ ] Include data filtering and search capabilities
- [ ] Add user authentication
- [ ] Implement data caching strategies
- [ ] Implement granular data fetch
