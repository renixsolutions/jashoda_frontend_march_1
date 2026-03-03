"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader2 } from 'lucide-react';

// Fix for default marker icon in leaflet with next/image
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AddressData {
    address: string;
    city: string;
    state: string;
    pincode: string;
}

interface AddressMapProps {
    onAddressSelect: (data: AddressData) => void;
    defaultLocation?: { lat: number; lng: number };
}

// Map event handler to capture clicks and move marker
function LocationMarker({ position, setPosition, onLocationUpdate }: { position: L.LatLng | null, setPosition: (p: L.LatLng) => void, onLocationUpdate: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationUpdate(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

export default function AddressMap({ onAddressSelect, defaultLocation }: AddressMapProps) {
    const [position, setPosition] = useState<L.LatLng | null>(
        defaultLocation ? new L.LatLng(defaultLocation.lat, defaultLocation.lng) : null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Default to center of India if no location provided
    const center: L.LatLngExpression = defaultLocation
        ? [defaultLocation.lat, defaultLocation.lng]
        : [20.5937, 78.9629];
    const zoom = defaultLocation ? 16 : 5;

    const fetchAddressInfo = async (lat: number, lng: number) => {
        setIsLoading(true);
        setError('');
        try {
            // Use Nominatim reverse geocoding API (OpenStreetMap)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.9',
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch address details');

            const data = await response.json();

            if (data && data.address) {
                const addr = data.address;

                // Format the display address
                const displayAddress = data.display_name;
                setCurrentAddress(displayAddress);

                // Extract required fields
                const formattedAddress = [
                    addr.house_number,
                    addr.road,
                    addr.suburb,
                    addr.neighbourhood,
                    addr.residential
                ].filter(Boolean).join(', ') || addr.village || addr.town || '';

                const city = addr.city || addr.town || addr.municipality || addr.district || '';
                const state = addr.state || '';
                const pincode = addr.postcode || '';

                // Normalize state to map closely to STATE_CITY_MAP if possible
                let normalizedState = state;
                const stateMapping: Record<string, string> = {
                    "NCT of Delhi": "Delhi",
                    "Odisha": "Odisha",
                    // Add other normalizations here if needed
                };

                if (stateMapping[state]) {
                    normalizedState = stateMapping[state];
                } else {
                    // Simple partial match logic (Optional robustness)
                    // You could import STATE_CITY_MAP here for advanced matching if needed
                }

                onAddressSelect({
                    address: formattedAddress,
                    city: city,
                    state: normalizedState,
                    pincode: pincode
                });
            }
        } catch (err) {
            console.error("Geocoding error:", err);
            setError('Could not get address details for this location.');
        } finally {
            setIsLoading(false);
        }
    };

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const newPos = new L.LatLng(latitude, longitude);
                setPosition(newPos);
                fetchAddressInfo(latitude, longitude);
            },
            (err) => {
                setError('Could not get your location. Please click on the map.');
                setIsLoading(false);
            }
        );
    };

    // Initially try to get location if we don't have one
    useEffect(() => {
        if (!position) {
            getUserLocation();
        }
    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-3">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-gray-700">Selected Location</p>
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Loader2 className="w-4 h-4 animate-spin" /> Fetching address...
                        </div>
                    ) : currentAddress ? (
                        <p className="text-sm text-gray-900 mt-1 truncate" title={currentAddress}>
                            {currentAddress}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 mt-1 italic">Click on the map to select</p>
                    )}
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
                <button
                    type="button"
                    onClick={getUserLocation}
                    className="shrink-0 flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <MapPin className="w-4 h-4" />
                    Locate Me
                </button>
            </div>

            <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 z-0">
                <MapContainer
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    {/* 
              Setting attribution implicitly required by OpenStreetMap 
              For production, you might want to use a more styled tile provider like Mapbox or Stadia if needed
            */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                        position={position}
                        setPosition={setPosition}
                        onLocationUpdate={fetchAddressInfo}
                    />
                </MapContainer>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Click anywhere on the map to update your address
            </p>
        </div>
    );
}
