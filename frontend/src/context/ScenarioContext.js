import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { dataService } from '../services/dataService';

const ScenarioContext = createContext();

const initialState = {
  scenarios: [],
  loading: false,
  error: null,
  comparisonMode: 'cards' // 'cards' or 'table'
};

const scenarioReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SCENARIOS':
      return { ...state, scenarios: action.payload, loading: false, error: null };
    case 'ADD_SCENARIO':
      return { ...state, scenarios: [...state.scenarios, action.payload] };
    case 'REMOVE_SCENARIO':
      return { 
        ...state, 
        scenarios: state.scenarios.filter(s => s.name !== action.payload) 
      };
    case 'SET_COMPARISON_MODE':
      return { ...state, comparisonMode: action.payload };
    case 'LOAD_PRELOADED_SCENARIOS':
      return { ...state, scenarios: action.payload, loading: false, error: null };
    default:
      return state;
  }
};

export const ScenarioProvider = ({ children }) => {
  const [state, dispatch] = useReducer(scenarioReducer, initialState);

  const loadPreloadedScenarios = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await dataService.getPreloadedScenarios();
      dispatch({ type: 'LOAD_PRELOADED_SCENARIOS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addScenario = async (scenarioData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await dataService.calculateScenario(scenarioData);
      dispatch({ type: 'ADD_SCENARIO', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const removeScenario = (scenarioName) => {
    dispatch({ type: 'REMOVE_SCENARIO', payload: scenarioName });
  };

  const setComparisonMode = (mode) => {
    dispatch({ type: 'SET_COMPARISON_MODE', payload: mode });
  };

  const generateInsights = () => {
    if (state.scenarios.length < 2) return null;

    const scenarios = state.scenarios;
    const baseline = scenarios[0];
    const comparison = scenarios[1];

    const costDifference = comparison.totalCost - baseline.totalCost;
    const co2Difference = comparison.co2Total - baseline.co2Total;

    return {
      costDifference: Math.round(costDifference * 100) / 100,
      co2Difference: Math.round(co2Difference),
      costPercentage: Math.round((costDifference / baseline.totalCost) * 100),
      co2Percentage: Math.round((co2Difference / baseline.co2Total) * 100),
      betterScenario: costDifference < 0 && co2Difference < 0 ? comparison.name : baseline.name
    };
  };

  useEffect(() => {
    loadPreloadedScenarios();
  }, []);

  const value = {
    ...state,
    addScenario,
    removeScenario,
    setComparisonMode,
    generateInsights,
    loadPreloadedScenarios
  };

  return (
    <ScenarioContext.Provider value={value}>
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenarios = () => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenarios must be used within a ScenarioProvider');
  }
  return context;
};
