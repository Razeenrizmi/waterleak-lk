import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import LeakFilters from './LeakFilters';
import LeakCard from './LeakCard';
import LeakPopup from './LeakPopup';
import LeakDetails from './LeakDetails';
import { mapService } from './mapService';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sample data for development (fallback if API fails)
const SAMPLE_LEAKS = [
  {
    _id: 'sample-1',
    location: 'Kandy',
    latitude: 7.2906,
    longitude: 80.6337,
    leakType: 'Main Pipeline Burst',
    description: 'Water leaking near the roadside.',
    status: 'PENDING',
    createdAt: '2026-09-04T08:30:00Z',
    severityLevel: 'HIGH',
    severityScore: 75,
    estimatedLossPerHourLiters: 1000,
    priorityScore: 80,
    recommendedAction: 'Dispatch local NWSDB maintenance team',
    targetAuthority: 'NWSDB Quick Response Unit',
    safetyAdvisory: 'Drive with caution'
  },
  {
    _id: 'sample-2',
    location: 'Colombo',
    latitude: 6.9271,
    longitude: 79.8612,
    leakType: 'Commercial Overflow',
    description: 'Continuous water leakage reported.',
    status: 'DISPATCHED',
    createdAt: '2026-09-04T09:10:00Z',
    severityLevel: 'MEDIUM',
    severityScore: 60,
    estimatedLossPerHourLiters: 800,
    priorityScore: 65,
    recommendedAction: 'Inspect commercial meter coupling',
    targetAuthority: 'NWSDB Quick Response Unit',
    safetyAdvisory: 'Slippery footway'
  },
  {
    _id: 'sample-3',
    location: 'Galle',
    latitude: 6.0329,
    longitude: 80.2168,
    leakType: 'Roadway Surface Leak',
    description: 'Possible damaged water pipe.',
    status: 'RESOLVED',
    createdAt: '2026-09-03T14:20:00Z',
    severityLevel: 'LOW',
    severityScore: 40,
    estimatedLossPerHourLiters: 300,
    priorityScore: 45,
    recommendedAction: 'Routine inspection completed',
    targetAuthority: 'Local Municipal Council',
    safetyAdvisory: 'None'
  },
  {
    _id: 'sample-4',
    location: 'Kurunegala',
    latitude: 7.4863,
    longitude: 80.3647,
    leakType: 'Subsurface Main Seepage',
    description: 'Underground water seepage detected.',
    status: 'VERIFIED',
    createdAt: '2026-09-04T10:00:00Z',
    severityLevel: 'HIGH',
    severityScore: 70,
    estimatedLossPerHourLiters: 1200,
    priorityScore: 75,
    recommendedAction: 'Excavation and repair required',
    targetAuthority: 'NWSDB Regional Office',
    safetyAdvisory: 'Road may weaken'
  }
];

export default function LeakMap({ initialLeaks = [] }) {
  const [allLeaks, setAllLeaks] = useState([]);
  const [filteredLeaks, setFilteredLeaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [leakTypeFilter, setLeakTypeFilter] = useState('All');
  const [selectedLeak, setSelectedLeak] = useState(null);
  const [useSampleData, setUseSampleData] = useState(false);

  // Fetch leaks from API
  useEffect(() => {
    const fetchLeaks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        const response = await mapService.getAllLeaks();
        
        if (response.success && response.data && response.data.length > 0) {
          setAllLeaks(response.data);
          setFilteredLeaks(response.data);
          setUseSampleData(false);
        } else {
          // If API returns empty data, use sample data
          console.log('API returned empty data, using sample data');
          setAllLeaks(SAMPLE_LEAKS);
          setFilteredLeaks(SAMPLE_LEAKS);
          setUseSampleData(true);
        }
      } catch (err) {
        console.error('Failed to fetch leaks from API:', err);
        // On error, use sample data as fallback
        console.log('Using sample data as fallback');
        setAllLeaks(SAMPLE_LEAKS);
        setFilteredLeaks(SAMPLE_LEAKS);
        setUseSampleData(true);
        setError('Unable to load leak reports from server. Using sample data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaks();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = allLeaks;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(leak => 
        (leak.location && leak.location.toLowerCase().includes(query)) ||
        (leak.leakType && leak.leakType.toLowerCase().includes(query)) ||
        (leak.description && leak.description.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(leak => leak.status === statusFilter);
    }

    // Apply leak type filter
    if (leakTypeFilter !== 'All') {
      filtered = filtered.filter(leak => leak.leakType === leakTypeFilter);
    }

    setFilteredLeaks(filtered);
  }, [searchQuery, statusFilter, leakTypeFilter, allLeaks]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setLeakTypeFilter('All');
  };

  // Handle view details
  const handleViewDetails = (leak) => {
    setSelectedLeak(leak);
  };

  // Handle back to map
  const handleBackToMap = () => {
    setSelectedLeak(null);
  };

  // Retry API call
  const handleRetry = () => {
    setUseSampleData(false);
    setError(null);
    setLoading(true);
    mapService.getAllLeaks()
      .then(response => {
        if (response.success && response.data && response.data.length > 0) {
          setAllLeaks(response.data);
          setFilteredLeaks(response.data);
          setUseSampleData(false);
        } else {
          setAllLeaks(SAMPLE_LEAKS);
          setFilteredLeaks(SAMPLE_LEAKS);
          setUseSampleData(true);
        }
      })
      .catch(err => {
        setAllLeaks(SAMPLE_LEAKS);
        setFilteredLeaks(SAMPLE_LEAKS);
        setUseSampleData(true);
        setError('Unable to load leak reports from server. Using sample data.');
      })
      .finally(() => setLoading(false));
  };

  // If a leak is selected, show details
  if (selectedLeak) {
    return (
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl">
        <LeakDetails leak={selectedLeak} onBack={handleBackToMap} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Water Leak Map</h2>
        <p className="text-slate-400 text-sm">Find and explore reported water leaks across Sri Lanka.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
            <p className="text-sm text-yellow-200">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-slate-900 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Sample Data Notice */}
      {useSampleData && !error && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <p className="text-xs text-cyan-300">
            Using sample data for demonstration. Connect to backend API for real leak reports.
          </p>
        </div>
      )}

      {/* Filters */}
      <LeakFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        leakTypeFilter={leakTypeFilter}
        setLeakTypeFilter={setLeakTypeFilter}
        onReset={handleResetFilters}
      />

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-slate-400">Loading leak reports...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredLeaks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <MapPin className="w-12 h-12 text-slate-600" />
              <p className="text-sm text-slate-400">
                {searchQuery || statusFilter !== 'All' || leakTypeFilter !== 'All'
                  ? 'No leaks match your search or filters.'
                  : 'No leak reports found.'}
              </p>
              {(searchQuery || statusFilter !== 'All' || leakTypeFilter !== 'All') && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 text-sm font-medium rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Main Content - Desktop: Side by side, Mobile: Stacked */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leak Cards List */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Leak Reports ({filteredLeaks.length})
                  </h3>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredLeaks.map((leak) => (
                      <LeakCard
                        key={leak._id || leak.id}
                        leak={leak}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Sri Lanka Map
                  </h3>
                  <div className="h-[500px] rounded-xl overflow-hidden border border-slate-700">
                    <MapContainer
                      center={[7.8731, 80.7718]}
                      zoom={7}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {filteredLeaks.map((leak) => {
                        const lat = leak.latitude || leak.lat;
                        const lng = leak.longitude || leak.lng;
                        
                        if (!lat || !lng) return null;
                        
                        return (
                          <Marker
                            key={leak._id || leak.id}
                            position={[lat, lng]}
                          >
                            <Popup>
                              <LeakPopup leak={leak} onViewDetails={handleViewDetails} />
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
