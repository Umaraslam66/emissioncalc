import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
// Custom icons for transport modes

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color, icon) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${icon}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const trainIcon = createCustomIcon('#22c55e', '🚂');
const truckIcon = createCustomIcon('#f59e0b', '🚛');
const electricIcon = createCustomIcon('#0ea5e9', '⚡');
const terminalIcon = createCustomIcon('#8b5cf6', '🏭');

// Map bounds controller
const MapBoundsController = ({ scenarios }) => {
  const map = useMap();
  
  useEffect(() => {
    if (scenarios && scenarios.length > 0) {
      const allRoutes = scenarios.flatMap(scenario => scenario.route || []);
      if (allRoutes.length > 0) {
        const bounds = L.latLngBounds(allRoutes);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [scenarios, map]);
  
  return null;
};

const TransportMap = ({ scenarios, selectedScenario, onScenarioSelect }) => {
  const [mapCenter] = useState([63.2, 14.7]); // Hissmofors area
  const [mapZoom] = useState(10);

  const getRouteColor = (scenario) => {
    if (scenario.transportMode === 'rail_electric') return '#0ea5e9';
    if (scenario.transportMode === 'rail_diesel') return '#22c55e';
    return '#f59e0b';
  };

  const getRouteWeight = (scenario) => {
    return scenario === selectedScenario ? 6 : 4;
  };

  const getRouteOpacity = (scenario) => {
    return scenario === selectedScenario ? 0.8 : 0.5;
  };

  const getIconForScenario = (scenario) => {
    if (scenario.transportMode === 'rail_electric') return electricIcon;
    if (scenario.transportMode === 'rail_diesel') return trainIcon;
    return truckIcon;
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBoundsController scenarios={scenarios} />
        
        {scenarios.map((scenario, index) => {
          if (!scenario.route || scenario.route.length < 2) return null;
          
          return (
            <React.Fragment key={scenario.name}>
              {/* Route line */}
              <Polyline
                positions={scenario.route}
                color={getRouteColor(scenario)}
                weight={getRouteWeight(scenario)}
                opacity={getRouteOpacity(scenario)}
                dashArray={scenario.transportMode === 'rail_electric' ? '10, 5' : undefined}
                eventHandlers={{
                  click: () => onScenarioSelect && onScenarioSelect(scenario)
                }}
              />
              
              {/* Start marker */}
              <Marker
                position={scenario.route[0]}
                icon={terminalIcon}
                eventHandlers={{
                  click: () => onScenarioSelect && onScenarioSelect(scenario)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                    <p className="text-sm text-gray-600">Start: Hissmofors Terminal</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm">
                        <span className="font-medium">Mode:</span>
                        <span className="ml-2 capitalize">
                          {scenario.transportMode.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium">Tonnage:</span>
                        <span className="ml-2">{scenario.tonnage.toLocaleString()} t/year</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* End marker */}
              <Marker
                position={scenario.route[scenario.route.length - 1]}
                icon={getIconForScenario(scenario)}
                eventHandlers={{
                  click: () => onScenarioSelect && onScenarioSelect(scenario)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                    <p className="text-sm text-gray-600">Destination</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm">
                        <span className="font-medium">Cost:</span>
                        <span className="ml-2">{scenario.totalCost} MSEK</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium">CO₂:</span>
                        <span className="ml-2">{scenario.co2Total} t</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Transport Modes</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-1 bg-blue-500 mr-2"></div>
            <span>Electric Rail</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-green-500 mr-2"></div>
            <span>Diesel Rail</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-yellow-500 mr-2"></div>
            <span>Truck</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportMap;
