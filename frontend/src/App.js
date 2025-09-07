import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ScenarioBuilder from './components/ScenarioBuilder';
import ScenarioComparison from './components/ScenarioComparison';
import Dashboard from './components/Dashboard';
import { ScenarioProvider } from './context/ScenarioContext';

function App() {
  return (
    <ScenarioProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/builder" element={<ScenarioBuilder />} />
              <Route path="/comparison" element={<ScenarioComparison />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ScenarioProvider>
  );
}

export default App;
