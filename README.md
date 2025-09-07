# Transport & Emissions Calculator

A React web application for scenario-based transport and emissions calculation. This tool helps logistics decision-makers create, edit, and compare transport scenarios to make informed decisions about cost and environmental impact. Features interactive maps, comprehensive visualizations, and dummy data based on the Hissmofors case study.

## 🎯 Features

- **Interactive Map Visualization**: See transport routes on an interactive map with different transport modes
- **Scenario Builder**: Create transport scenarios with tonnage, transport modes, distances, and frequency
- **Cost & CO₂ Calculation**: Dummy calculations based on Hissmofors case study (ready for NTMcalc API integration)
- **Advanced Visualizations**: Multiple chart types including bar charts, area charts, pie charts, and efficiency metrics
- **Visual Comparison**: Compare scenarios with interactive charts and tables
- **Insights Generation**: Automatic analysis of cost and emissions differences between scenarios
- **Preloaded Examples**: Hissmofors case study scenarios included
- **Modern UI**: Clean, professional interface built with React and TailwindCSS
- **Pure Frontend**: No backend required - perfect for GitHub Pages deployment

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Lucide React** - Icons
- **Leaflet** - Interactive maps
- **React Leaflet** - React integration for maps

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd transport-emissions-calculator
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

### GitHub Pages Deployment

This is a pure frontend application, perfect for GitHub Pages:

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   - Enable GitHub Pages in repository settings
   - Set source to "GitHub Actions" or "Deploy from a branch"
   - The `build` folder contains the deployable files

## 🚀 Usage

### Creating Scenarios

1. Navigate to **Scenario Builder** from the main menu
2. Fill in the required fields:
   - **Scenario Name**: Descriptive name for your scenario
   - **Annual Tonnage**: Total tons to be transported per year
   - **Transport Mode**: Choose between rail diesel, rail electric, or truck
   - **Train Frequency**: Number of trains per week (1,500 tons per train assumed)
   - **Distance to Terminal**: Truck distance to terminal (km)
   - **Distance to Customer**: Additional truck distance to customers (km)
3. Click **Calculate Scenario** to process and save the scenario

### Comparing Scenarios

1. Navigate to **Comparison** from the main menu
2. Toggle the **Map** view to see transport routes visually
3. View scenarios in **Card** or **Table** format
4. Use the **Select Scenarios** feature to focus on specific scenarios
5. Analyze the interactive charts:
   - **Cost Comparison**: Bar chart showing total costs
   - **CO₂ Emissions**: Area chart showing emissions comparison
   - **CO₂ Breakdown**: Pie chart showing rail vs truck emissions
   - **Efficiency Metrics**: Detailed efficiency analysis
6. Review the **Key Insights** section for automatic analysis
7. Click on map routes or markers to select scenarios

### Preloaded Scenarios

The application includes two preloaded scenarios from the Hissmofors case study:

1. **Current Terminal (Diesel, Limited Capacity)**
   - 180,000 tons/year rail (2.5 trains/week)
   - 440,000 tons/year truck to terminal (160 km)
   - 100,000 tons/year truck to customer (240 km)
   - Cost: 89.8 MSEK/year
   - CO₂: 2,908 t/year

2. **Upgraded Electrified Terminal (High Capacity)**
   - 720,000 tons/year rail (10 trains/week)
   - 0 truck detour
   - Cost: 86 MSEK/year
   - CO₂: 0 t/year

## 🔧 Data Service

The application uses a local data service that simulates API calls with dummy data:

### Data Service Functions

- `getPreloadedScenarios()` - Get Hissmofors case study scenarios
- `calculateScenario(scenarioData)` - Calculate new scenario with dummy logic
- `healthCheck()` - Service health check

### Example Usage

```javascript
import { dataService } from './services/dataService';

// Get preloaded scenarios
const scenarios = await dataService.getPreloadedScenarios();

// Calculate new scenario
const result = await dataService.calculateScenario({
  name: "Test Scenario",
  tonnage: 500000,
  transportMode: "rail_electric",
  trainFrequency: 5,
  distanceToTerminal: 50,
  distanceToCustomer: 100
});
```

## 🔮 NTMcalc Integration

The application is designed for easy integration with the NTMcalc API. Integration points are clearly marked with `// TODO: integrate NTMcalc API` comments in the data service.

### Integration Steps

1. **Update dataService.js:**
   - Replace dummy calculation logic in `calculateScenario()` function
   - Implement actual NTMcalc API calls
   - Add authentication headers and error handling

2. **Environment Variables:**
   ```bash
   # Add to .env file
   REACT_APP_NTMCALC_API_KEY=your_api_key_here
   REACT_APP_NTMCALC_BASE_URL=https://api.ntmcalc.se/v1
   ```

3. **Update Calculation Logic:**
   - Replace hardcoded rates with NTMcalc API responses
   - Implement proper error handling for API failures
   - Add caching for improved performance

## 📊 Calculation Logic (Current Dummy Implementation)

### Cost Calculations
- **Rail Cost**: 115-120 SEK/ton (electric vs diesel)
- **Truck Cost**: 8 SEK/ton/km
- **Total Cost**: Rail cost + Truck cost (converted to MSEK)

### CO₂ Calculations
- **Diesel Train**: 45 liters/mil, 3.0 kg CO₂e/liter
- **Electric Train**: 0 CO₂ (fossil-free electricity)
- **Truck**: 5 liters/mil, 3.0 kg CO₂e/liter

### Assumptions
- 1,500 tons per train
- 50 tons per truck
- 52 weeks per year

## 🎨 UI Components

### Core Components
- `Header` - Navigation and branding
- `Dashboard` - Overview and quick actions
- `ScenarioBuilder` - Form for creating scenarios
- `ScenarioComparison` - Charts, tables, and insights
- `ScenarioCard` - Individual scenario display
- `ScenarioTable` - Tabular comparison view

### Styling
- **Design System**: Professional, clean interface
- **Color Palette**: Primary blue, success green, warning orange, danger red
- **Responsive**: Mobile-first design with TailwindCSS
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🚀 Production Deployment

### Build for Production

1. **Build the application:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the build folder:**
   - The `build` folder contains all static files
   - Deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

### GitHub Pages Deployment

1. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch or `main` branch `/docs` folder

2. **Deploy using GitHub Actions (Recommended):**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
         - name: Install dependencies
           run: cd frontend && npm install
         - name: Build
           run: cd frontend && npm run build
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./frontend/build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Review the browser console for any errors
- Ensure all dependencies are installed correctly
- Check that Node.js version is 16 or higher
- Verify the application is running on `http://localhost:3000`

## 🔄 Future Enhancements

- [ ] NTMcalc API integration
- [ ] Export functionality (PDF, CSV)
- [ ] Scenario sharing via URL
- [ ] Advanced filtering and sorting
- [ ] Historical scenario tracking
- [ ] Multi-language support
- [ ] Advanced chart types
- [ ] Scenario templates
- [ ] User authentication
- [ ] Scenario collaboration

---

**Built with ❤️ for sustainable logistics decision-making**
