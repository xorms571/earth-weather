import React, { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';

interface MapPickerProps {
  onLocationSelect: (lat: number, lon: number) => void;
  onClose: () => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect, onClose }) => {
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 text-red-500">Google Maps API Key is not configured.</div>;
  }

  const handleMapClick = (event: MapMouseEvent) => {
    if (event.detail.latLng) {
      setSelectedPosition(event.detail.latLng);
    }
  };

  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationSelect(selectedPosition.lat, selectedPosition.lng);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex flex-col items-center justify-center">
        <div className='w-full h-full max-w-4xl max-h-[80%] p-4'>
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={{ lat: 37.5665, lng: 126.9780 }} // Default to Seoul
                    defaultZoom={5}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    onClick={handleMapClick}
                    mapId="weather-map-picker"
                >
                    {selectedPosition && <AdvancedMarker position={selectedPosition} />}
                </Map>
            </APIProvider>
        </div>
        <div className="p-4 flex gap-4">
            <button onClick={handleConfirm} disabled={!selectedPosition} className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-500">
            Confirm Location
            </button>
            <button onClick={onClose} className="px-6 py-2 bg-gray-700 text-white rounded-md">
            Close
            </button>
      </div>
    </div>
  );
};

export default MapPicker;
