// Dummy calculation logic based on Hissmofors case study
const calculateScenario = (scenario) => {
  const {
    name,
    tonnage,
    transportMode,
    trainFrequency,
    distanceToTerminal,
    distanceToCustomer
  } = scenario;

  // Base calculations (dummy logic)
  let railCapacity = 0;
  let truckVolume = 0;
  let totalCost = 0;
  let co2Rail = 0;
  let co2Truck = 0;
  let notes = [];

  // Calculate rail capacity based on train frequency
  // Assuming 1500 tons per train (from case study)
  railCapacity = trainFrequency * 1500 * 52; // trains/week * tons/train * weeks/year

  // Calculate truck volume (remaining tonnage)
  truckVolume = Math.max(0, tonnage - railCapacity);

  // Cost calculations (dummy rates from case study)
  const railCostPerTon = transportMode === 'rail_electric' ? 115 : 120; // SEK/ton
  const truckCostPerTonKm = 8; // SEK/ton/km (from case study)
  
  totalCost = (railCapacity * railCostPerTon) + (truckVolume * truckCostPerTonKm * (distanceToTerminal + distanceToCustomer) / 1000);
  totalCost = totalCost / 1000000; // Convert to MSEK

  // CO2 calculations (dummy rates)
  if (transportMode === 'rail_diesel') {
    // 45 liters/mil for diesel train, 3.0 kg CO2e/liter
    co2Rail = railCapacity * (distanceToTerminal / 10) * 45 * 3.0 / 1000; // tons CO2e
  } else if (transportMode === 'rail_electric') {
    co2Rail = 0; // Electric rail with fossil-free electricity
  }

  // Truck CO2: 5 liters/mil, 3.0 kg CO2e/liter
  co2Truck = truckVolume * (distanceToTerminal + distanceToCustomer) / 10 * 5 * 3.0 / 1000; // tons CO2e

  // Generate notes based on scenario
  if (transportMode === 'rail_electric') {
    notes.push('Electric rail transport with zero CO2 emissions');
  }
  if (truckVolume > 0) {
    notes.push(`${truckVolume.toLocaleString()} tons/year transported by truck`);
  }
  if (railCapacity > 0) {
    notes.push(`${railCapacity.toLocaleString()} tons/year transported by rail`);
  }

  return {
    name,
    railCapacity: Math.round(railCapacity),
    truckVolume: Math.round(truckVolume),
    totalCost: Math.round(totalCost * 100) / 100, // Round to 2 decimal places
    co2Rail: Math.round(co2Rail),
    co2Truck: Math.round(co2Truck),
    co2Total: Math.round(co2Rail + co2Truck),
    notes,
    // Additional metadata
    transportMode,
    trainFrequency,
    distanceToTerminal,
    distanceToCustomer,
    tonnage,
    // Map data
    route: generateRouteData(scenario)
  };
};

// Generate route data for map visualization
const generateRouteData = (scenario) => {
  // Hissmofors coordinates (approximate)
  const hissmofors = [63.2, 14.8];
  const ostersund = [63.2, 14.6];
  
  // Generate route based on scenario
  const route = [hissmofors];
  
  if (scenario.distanceToTerminal > 0) {
    // Add intermediate terminal point
    const terminalPoint = [
      hissmofors[0] + (Math.random() - 0.5) * 0.1,
      hissmofors[1] + (Math.random() - 0.5) * 0.1
    ];
    route.push(terminalPoint);
  }
  
  if (scenario.distanceToCustomer > 0) {
    // Add customer destination
    const customerPoint = [
      ostersund[0] + (Math.random() - 0.5) * 0.2,
      ostersund[1] + (Math.random() - 0.5) * 0.2
    ];
    route.push(customerPoint);
  } else {
    route.push(ostersund);
  }
  
  return route;
};

// Preloaded scenarios from Hissmofors case study
export const preloadedScenarios = [
  {
    name: 'Current Terminal (Diesel, Limited Capacity)',
    tonnage: 720000,
    transportMode: 'rail_diesel',
    trainFrequency: 2.5,
    distanceToTerminal: 80,
    distanceToCustomer: 120,
    description: 'Current situation with diesel trains and limited capacity'
  },
  {
    name: 'Upgraded Electrified Terminal (High Capacity)',
    tonnage: 720000,
    transportMode: 'rail_electric',
    trainFrequency: 10,
    distanceToTerminal: 0,
    distanceToCustomer: 0,
    description: 'Future scenario with electrified terminal and full rail capacity'
  }
];

// Calculate preloaded scenarios
export const calculatedPreloadedScenarios = preloadedScenarios.map(scenario => calculateScenario(scenario));

// API simulation functions
export const dataService = {
  // Simulate API delay
  delay: (ms = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  // Get preloaded scenarios
  async getPreloadedScenarios() {
    await this.delay(300);
    return {
      success: true,
      data: calculatedPreloadedScenarios
    };
  },

  // Calculate new scenario
  async calculateScenario(scenarioData) {
    await this.delay(800);
    
    // Validate required fields
    const requiredFields = ['name', 'tonnage', 'transportMode', 'trainFrequency', 'distanceToTerminal', 'distanceToCustomer'];
    const missingFields = requiredFields.filter(field => !scenarioData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const result = calculateScenario(scenarioData);
    
    return {
      success: true,
      data: result
    };
  },

  // Health check
  async healthCheck() {
    await this.delay(100);
    return {
      status: 'OK',
      message: 'Transport Calculator Data Service is running'
    };
  }
};

export default dataService;
