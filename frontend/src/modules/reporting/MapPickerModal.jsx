import React, { useState } from 'react';
import { MapPin, Check, X, Compass, Search } from 'lucide-react';

const SRI_LANKA_LOCATIONS = [
  { name: 'Galle Road, Bambalapitiya, Colombo 04', lat: 6.8885, lng: 79.8558, district: 'Colombo' },
  { name: 'Kandy Road, Kiribathgoda', lat: 6.9789, lng: 79.9275, district: 'Gampaha' },
  { name: 'Dalada Veediya, Kandy City Center', lat: 7.2906, lng: 80.6337, district: 'Kandy' },
  { name: 'Main Street, Galle Fort, Galle', lat: 6.0329, lng: 80.2168, district: 'Galle' },
  { name: 'Hospital Road, Jaffna Town', lat: 9.6615, lng: 80.0255, district: 'Jaffna' },
  { name: 'Beach Road, Negombo', lat: 7.2083, lng: 79.8358, district: 'Gampaha' },
  { name: 'Main Street, Kurunegala', lat: 7.4863, lng: 80.3647, district: 'Kurunegala' },
  { name: 'High Level Road, Maharagama', lat: 6.8480, lng: 79.9265, district: 'Colombo' },
];

export default function MapPickerModal({ isOpen, onClose, onSelectLocation, initialLocation }) {
  const [selectedLoc, setSelectedLoc] = useState(
    SRI_LANKA_LOCATIONS[0]
  );
  const [customAddress, setCustomAddress] = useState(initialLocation || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapPin, setMapPin] = useState({ x: 50, y: 65 }); // relative percentage on map view

  if (!isOpen) return null;

  const filteredLocations = SRI_LANKA_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMapPin({ x, y });

    // Approx lat/lng calculation based on grid
    const approxLat = (9.8 - (y / 100) * 4.0).toFixed(4);
    const approxLng = (79.5 + (x / 100) * 2.5).toFixed(4);

    const generatedAddr = `Selected Map Coordinates (${approxLat}° N, ${approxLng}° E)`;
    setCustomAddress(generatedAddr);
    setSelectedLoc({
      name: generatedAddr,
      lat: parseFloat(approxLat),
      lng: parseFloat(approxLng),
      district: 'Map Pin Location'
    });
  };

  const handleConfirm = () => {
    onSelectLocation({
      address: customAddress || selectedLoc.name,
      lat: selectedLoc.lat,
      lng: selectedLoc.lng
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Select Location on Map</h3>
              <p className="text-xs text-slate-400">Pick a location across Sri Lanka or click on the map grid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Map Simulation Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-cyan-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Interactive Sri Lanka Map Picker
              </span>
              <span>Click anywhere on the map to drop a pin</span>
            </div>

            <div
              onClick={handleMapClick}
              className="relative w-full h-64 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden cursor-crosshair group shadow-inner flex items-center justify-center"
              style={{
                backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#0f172a 1px, #020617 1px)`,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }}
            >
              {/* Map Outline Graphic */}
              <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                <svg viewBox="0 0 200 300" className="h-full text-cyan-500 fill-current">
                  <path d="M100,20 C130,50 160,100 150,160 C140,220 120,270 95,280 C70,270 50,220 50,160 C45,100 70,50 100,20 Z" />
                </svg>
              </div>

              {/* Grid Overlay lines */}
              <div className="absolute inset-0 pointer-events-none border border-slate-800/40 divide-y divide-slate-800/30">
                <div className="h-1/4 w-full"></div>
                <div className="h-1/4 w-full"></div>
                <div className="h-1/4 w-full"></div>
              </div>

              {/* Pin Indicator */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-150 pointer-events-none flex flex-col items-center"
                style={{ left: `${mapPin.x}%`, top: `${mapPin.y}%` }}
              >
                <div className="bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-cyan-300 whitespace-nowrap mb-1">
                  📍 {selectedLoc.lat.toFixed(2)}, {selectedLoc.lng.toFixed(2)}
                </div>
                <MapPin className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-bounce" />
                <div className="w-3 h-1.5 bg-cyan-400/40 rounded-full blur-[2px]"></div>
              </div>

              {/* Bottom Info bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-2 rounded-xl text-xs flex items-center justify-between">
                <span className="text-slate-300 font-mono truncate">
                  Lat: {selectedLoc.lat} | Lng: {selectedLoc.lng}
                </span>
                <span className="text-cyan-400 font-semibold text-[11px] bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800/50">
                  {selectedLoc.district || 'Custom Location'}
                </span>
              </div>
            </div>
          </div>

          {/* Preset Locations list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Popular Sri Lanka Hotspots
              </h4>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search city/area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredLocations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedLoc(loc);
                    setCustomAddress(loc.name);
                    // Update pin visually based on index preset
                    setMapPin({
                      x: 30 + (idx % 3) * 22,
                      y: 35 + Math.floor(idx / 2) * 14
                    });
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-2 ${
                    selectedLoc.name === loc.name
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-200">{loc.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {loc.lat}, {loc.lng}
                    </div>
                  </div>
                  {selectedLoc.name === loc.name && (
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <Check className="w-4 h-4" /> Apply Location
          </button>
        </div>
      </div>
    </div>
  );
}
