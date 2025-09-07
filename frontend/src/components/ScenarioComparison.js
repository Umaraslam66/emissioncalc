import React, { useState } from 'react';
import { useScenarios } from '../context/ScenarioContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Grid, List, Download, Share2, Trash2, TrendingUp, TrendingDown, Map, Eye, EyeOff } from 'lucide-react';
import TransportMap from './TransportMap';

const ScenarioComparison = () => {
  const { scenarios, removeScenario, setComparisonMode, comparisonMode, generateInsights } = useScenarios();
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showMap, setShowMap] = useState(true);

  const insights = generateInsights();

  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleScenarioSelect = (scenarioName) => {
    setSelectedScenarios(prev => {
      if (prev.includes(scenarioName)) {
        return prev.filter(name => name !== scenarioName);
      } else {
        return [...prev, scenarioName];
      }
    });
  };

  const getDisplayScenarios = () => {
    if (selectedScenarios.length > 0) {
      return scenarios.filter(s => selectedScenarios.includes(s.name));
    }
    return scenarios;
  };

  const displayScenarios = getDisplayScenarios();

  // Prepare data for charts
  const costChartData = displayScenarios.map((scenario, index) => ({
    name: scenario.name.length > 20 ? scenario.name.substring(0, 20) + '...' : scenario.name,
    fullName: scenario.name,
    cost: scenario.totalCost,
    color: COLORS[index % COLORS.length]
  }));

  const co2ChartData = displayScenarios.map((scenario, index) => ({
    name: scenario.name.length > 20 ? scenario.name.substring(0, 20) + '...' : scenario.name,
    fullName: scenario.name,
    rail: scenario.co2Rail,
    truck: scenario.co2Truck,
    total: scenario.co2Total,
    color: COLORS[index % COLORS.length]
  }));

  const pieChartData = displayScenarios.reduce((acc, scenario) => {
    acc.push(
      { name: `${scenario.name} (Rail)`, value: scenario.co2Rail, type: 'Rail' },
      { name: `${scenario.name} (Truck)`, value: scenario.co2Truck, type: 'Truck' }
    );
    return acc;
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].payload.fullName}</p>
          <p className="text-sm text-gray-600">
            Cost: {payload[0].value} MSEK
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.type}: {data.value} t CO₂
          </p>
        </div>
      );
    }
    return null;
  };

  if (scenarios.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Scenarios to Compare</h2>
        <p className="text-gray-600 mb-6">
          Create some scenarios first to see comparisons and insights.
        </p>
        <a href="/builder" className="btn-primary">
          Create Scenario
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scenario Comparison</h1>
          <p className="text-gray-600 mt-1">
            Compare transport scenarios and analyze costs, emissions, and efficiency
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* Map Toggle */}
          <button
            onClick={() => setShowMap(!showMap)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              showMap
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            {showMap ? <EyeOff className="h-4 w-4 inline mr-1" /> : <Eye className="h-4 w-4 inline mr-1" />}
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setComparisonMode('cards')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                comparisonMode === 'cards'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="h-4 w-4 inline mr-1" />
              Cards
            </button>
            <button
              onClick={() => setComparisonMode('table')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                comparisonMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4 inline mr-1" />
              Table
            </button>
          </div>

          {/* Export Actions */}
          <div className="flex space-x-2">
            <button className="btn-secondary text-sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
            <button className="btn-secondary text-sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Selection */}
      {scenarios.length > 2 && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Select Scenarios to Compare</h3>
          <div className="flex flex-wrap gap-2">
            {scenarios.map((scenario) => (
              <button
                key={scenario.name}
                onClick={() => handleScenarioSelect(scenario.name)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedScenarios.includes(scenario.name)
                    ? 'bg-primary-100 text-primary-800 border border-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {scenario.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {selectedScenarios.length === 0 
              ? `Showing all ${scenarios.length} scenarios`
              : `Showing ${selectedScenarios.length} selected scenarios`
            }
          </p>
        </div>
      )}

      {/* Insights */}
      {insights && (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Cost Impact</h4>
              <div className="flex items-center">
                {insights.costDifference < 0 ? (
                  <TrendingDown className="h-5 w-5 text-success-600 mr-2" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-danger-600 mr-2" />
                )}
                <span className={`font-semibold ${insights.costDifference < 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {Math.abs(insights.costDifference)} MSEK/year
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {insights.costDifference < 0 ? 'Savings' : 'Additional cost'} ({Math.abs(insights.costPercentage)}%)
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">CO₂ Impact</h4>
              <div className="flex items-center">
                {insights.co2Difference < 0 ? (
                  <TrendingDown className="h-5 w-5 text-success-600 mr-2" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-danger-600 mr-2" />
                )}
                <span className={`font-semibold ${insights.co2Difference < 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {Math.abs(insights.co2Difference)} t CO₂/year
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {insights.co2Difference < 0 ? 'Reduction' : 'Increase'} ({Math.abs(insights.co2Percentage)}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Visualization */}
      {showMap && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Map className="h-5 w-5 mr-2 text-primary-600" />
              Transport Routes Map
            </h3>
            <p className="text-sm text-gray-600">
              Click on routes or markers to select scenarios
            </p>
          </div>
          <TransportMap 
            scenarios={displayScenarios}
            selectedScenario={selectedScenario}
            onScenarioSelect={setSelectedScenario}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Comparison Chart */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Total Cost Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  stroke="#64748b"
                />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO₂ Emissions Comparison */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">CO₂ Emissions Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={co2ChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  stroke="#64748b"
                />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stackId="1" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO₂ Breakdown Pie Chart */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">CO₂ Emissions by Transport Mode</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'Rail' ? '#22c55e' : '#f59e0b'} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Rail</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-warning-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Truck</span>
            </div>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Transport Efficiency Metrics</h3>
          <div className="space-y-4">
            {displayScenarios.map((scenario, index) => {
              const efficiency = scenario.railCapacity / scenario.tonnage * 100;
              const costPerTon = scenario.totalCost / (scenario.tonnage / 1000000);
              const co2PerTon = scenario.co2Total / (scenario.tonnage / 1000);
              
              return (
                <div key={scenario.name} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{scenario.name}</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Rail Efficiency</div>
                      <div className="font-semibold text-primary-600">{efficiency.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Cost per Ton</div>
                      <div className="font-semibold text-gray-900">{costPerTon.toFixed(2)} SEK</div>
                    </div>
                    <div>
                      <div className="text-gray-600">CO₂ per Ton</div>
                      <div className="font-semibold text-warning-600">{co2PerTon.toFixed(2)} kg</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scenario Display */}
      {comparisonMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayScenarios.map((scenario, index) => (
            <ScenarioCard key={scenario.name} scenario={scenario} index={index} onRemove={removeScenario} />
          ))}
        </div>
      ) : (
        <ScenarioTable scenarios={displayScenarios} onRemove={removeScenario} />
      )}
    </div>
  );
};

const ScenarioCard = ({ scenario, index, onRemove }) => {
  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
  const color = COLORS[index % COLORS.length];

  return (
    <div className="card relative">
      <button
        onClick={() => onRemove(scenario.name)}
        className="absolute top-4 right-4 text-gray-400 hover:text-danger-600 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">{scenario.name}</h3>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
          <span className="text-sm text-gray-600 capitalize">
            {scenario.transportMode.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total Cost</span>
          <span className="font-semibold text-gray-900">{scenario.totalCost} MSEK</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total CO₂</span>
          <span className="font-semibold text-gray-900">{scenario.co2Total} t</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Rail Volume</span>
          <span className="font-semibold text-gray-900">{scenario.railCapacity.toLocaleString()} t</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Truck Volume</span>
          <span className="font-semibold text-gray-900">{scenario.truckVolume.toLocaleString()} t</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Annual Tonnage</span>
          <span className="font-semibold text-gray-900">{scenario.tonnage.toLocaleString()} t</span>
        </div>
      </div>

      {scenario.notes && scenario.notes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {scenario.notes.map((note, index) => (
              <li key={index}>• {note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ScenarioTable = ({ scenarios, onRemove }) => {
  const metrics = [
    { key: 'name', label: 'Scenario Name' },
    { key: 'totalCost', label: 'Total Cost (MSEK)', format: (value) => value },
    { key: 'co2Total', label: 'Total CO₂ (t)', format: (value) => value.toLocaleString() },
    { key: 'railCapacity', label: 'Rail Volume (t)', format: (value) => value.toLocaleString() },
    { key: 'truckVolume', label: 'Truck Volume (t)', format: (value) => value.toLocaleString() },
    { key: 'tonnage', label: 'Annual Tonnage (t)', format: (value) => value.toLocaleString() },
    { key: 'transportMode', label: 'Transport Mode', format: (value) => value.replace('_', ' ') }
  ];

  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {metrics.map((metric) => (
              <th
                key={metric.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {metric.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {scenarios.map((scenario) => (
            <tr key={scenario.name} className="hover:bg-gray-50">
              {metrics.map((metric) => (
                <td key={metric.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metric.format ? metric.format(scenario[metric.key]) : scenario[metric.key]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => onRemove(scenario.name)}
                  className="text-danger-600 hover:text-danger-900 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScenarioComparison;
