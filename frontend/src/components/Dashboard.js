import React from 'react';
import { Link } from 'react-router-dom';
import { useScenarios } from '../context/ScenarioContext';
import { Plus, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { scenarios, loading, error } = useScenarios();

  const getTotalCost = () => {
    return scenarios.reduce((sum, scenario) => sum + scenario.totalCost, 0);
  };

  const getTotalCO2 = () => {
    return scenarios.reduce((sum, scenario) => sum + scenario.co2Total, 0);
  };

  const getAverageCost = () => {
    return scenarios.length > 0 ? getTotalCost() / scenarios.length : 0;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-danger-600 mr-2" />
          <p className="text-danger-800">Error loading scenarios: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Transport & Emissions Calculator
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Build, compare, and analyze transport scenarios to make informed logistics decisions. 
          Calculate costs and CO₂ emissions for different transport modes and configurations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="metric-value text-primary-600">{scenarios.length}</div>
          <div className="metric-label">Scenarios</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-success-600">{getTotalCost().toFixed(1)} MSEK</div>
          <div className="metric-label">Total Cost</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-warning-600">{getTotalCO2().toLocaleString()} t</div>
          <div className="metric-label">Total CO₂</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-gray-600">{getAverageCost().toFixed(1)} MSEK</div>
          <div className="metric-label">Avg Cost/Scenario</div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Create New Scenario</h3>
            <Plus className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-gray-600 mb-4">
            Build a new transport scenario by defining tonnage, transport modes, distances, and frequency.
          </p>
          <Link to="/builder" className="btn-primary inline-flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Build Scenario
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Compare Scenarios</h3>
            <BarChart3 className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-gray-600 mb-4">
            Compare scenarios side-by-side with detailed analysis, charts, and insights.
          </p>
          <Link 
            to="/comparison" 
            className={`btn-primary inline-flex items-center ${
              scenarios.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={(e) => scenarios.length < 2 && e.preventDefault()}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare Scenarios
          </Link>
          {scenarios.length < 2 && (
            <p className="text-sm text-gray-500 mt-2">
              Need at least 2 scenarios to compare
            </p>
          )}
        </div>
      </div>

      {/* Recent Scenarios */}
      {scenarios.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Scenarios</h3>
          <div className="space-y-3">
            {scenarios.slice(0, 3).map((scenario, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                  <p className="text-sm text-gray-600">
                    {scenario.tonnage.toLocaleString()} tons/year • {scenario.transportMode}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{scenario.totalCost} MSEK</div>
                  <div className="text-sm text-gray-600">{scenario.co2Total} t CO₂</div>
                </div>
              </div>
            ))}
          </div>
          {scenarios.length > 3 && (
            <div className="mt-4 text-center">
              <Link to="/comparison" className="text-primary-600 hover:text-primary-700 font-medium">
                View all scenarios →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Getting Started */}
      {scenarios.length === 0 && (
        <div className="card text-center">
          <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started</h3>
          <p className="text-gray-600 mb-4">
            Create your first transport scenario to begin analyzing costs and emissions.
          </p>
          <Link to="/builder" className="btn-primary inline-flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create First Scenario
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
