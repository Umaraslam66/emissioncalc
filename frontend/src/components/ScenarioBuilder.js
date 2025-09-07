import React, { useState } from 'react';
import { useScenarios } from '../context/ScenarioContext';
import { Calculator, AlertCircle, CheckCircle } from 'lucide-react';

const ScenarioBuilder = () => {
  const { addScenario, loading, error } = useScenarios();
  const [formData, setFormData] = useState({
    name: '',
    tonnage: '',
    transportMode: 'rail_diesel',
    trainFrequency: '',
    distanceToTerminal: '',
    distanceToCustomer: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const transportModes = [
    { value: 'rail_diesel', label: 'Rail Diesel', description: 'Diesel-powered trains' },
    { value: 'rail_electric', label: 'Rail Electric', description: 'Electric trains with fossil-free electricity' },
    { value: 'truck', label: 'Truck Only', description: 'Road transport only' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    
    try {
      const scenarioData = {
        ...formData,
        tonnage: parseFloat(formData.tonnage),
        trainFrequency: parseFloat(formData.trainFrequency),
        distanceToTerminal: parseFloat(formData.distanceToTerminal),
        distanceToCustomer: parseFloat(formData.distanceToCustomer)
      };

      await addScenario(scenarioData);
      setSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        tonnage: '',
        transportMode: 'rail_diesel',
        trainFrequency: '',
        distanceToTerminal: '',
        distanceToCustomer: ''
      });
    } catch (err) {
      console.error('Error creating scenario:', err);
    }
  };

  const isFormValid = () => {
    return formData.name && 
           formData.tonnage && 
           formData.trainFrequency && 
           formData.distanceToTerminal !== '' && 
           formData.distanceToCustomer !== '';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Scenario Builder</h1>
        <p className="text-lg text-gray-600">
          Create a new transport scenario by defining the key parameters
        </p>
      </div>

      {submitted && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-success-600 mr-2" />
            <p className="text-success-800">Scenario created successfully!</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-danger-600 mr-2" />
            <p className="text-danger-800">Error: {error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Scenario Name */}
        <div>
          <label htmlFor="name" className="form-label">
            Scenario Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., Current Terminal Setup"
            required
          />
        </div>

        {/* Tonnage */}
        <div>
          <label htmlFor="tonnage" className="form-label">
            Annual Tonnage (tons/year) *
          </label>
          <input
            type="number"
            id="tonnage"
            name="tonnage"
            value={formData.tonnage}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 720000"
            min="0"
            step="1000"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Total annual tonnage to be transported
          </p>
        </div>

        {/* Transport Mode */}
        <div>
          <label className="form-label">Primary Transport Mode *</label>
          <div className="space-y-3">
            {transportModes.map((mode) => (
              <label key={mode.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="transportMode"
                  value={mode.value}
                  checked={formData.transportMode === mode.value}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div>
                  <div className="font-medium text-gray-900">{mode.label}</div>
                  <div className="text-sm text-gray-600">{mode.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Train Frequency */}
        <div>
          <label htmlFor="trainFrequency" className="form-label">
            Train Frequency (trains/week) *
          </label>
          <input
            type="number"
            id="trainFrequency"
            name="trainFrequency"
            value={formData.trainFrequency}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 2.5"
            min="0"
            step="0.1"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Number of trains per week (assuming 1,500 tons per train)
          </p>
        </div>

        {/* Distance to Terminal */}
        <div>
          <label htmlFor="distanceToTerminal" className="form-label">
            Distance to Terminal (km) *
          </label>
          <input
            type="number"
            id="distanceToTerminal"
            name="distanceToTerminal"
            value={formData.distanceToTerminal}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 80"
            min="0"
            step="1"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Distance for truck transport to terminal (0 if no truck transport needed)
          </p>
        </div>

        {/* Distance to Customer */}
        <div>
          <label htmlFor="distanceToCustomer" className="form-label">
            Distance to Customer (km) *
          </label>
          <input
            type="number"
            id="distanceToCustomer"
            name="distanceToCustomer"
            value={formData.distanceToCustomer}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 120"
            min="0"
            step="1"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Additional distance for direct truck transport to customers
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className="btn-primary inline-flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Scenario
              </>
            )}
          </button>
        </div>
      </form>

      {/* Help Section */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Better Results</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use realistic tonnage values based on your actual transport needs</li>
          <li>• Train frequency affects rail capacity (1,500 tons per train assumed)</li>
          <li>• Electric rail transport has zero CO₂ emissions with fossil-free electricity</li>
          <li>• Set terminal distance to 0 if all transport is by rail</li>
          <li>• Compare multiple scenarios to find the most cost-effective and sustainable option</li>
        </ul>
      </div>
    </div>
  );
};

export default ScenarioBuilder;
