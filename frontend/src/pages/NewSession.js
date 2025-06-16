import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { sessions } from '../services/api';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const NewSession = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: {
      name: '',
      coordinates: { lat: 0, lng: 0 },
    },
    conditions: {
      visibility: 3,
      waterTemp: '',
      tide: 'rising',
      weather: '',
    },
    catches: [],
    notes: '',
  });
  const [mapPosition, setMapPosition] = useState(null);
  const [newCatch, setNewCatch] = useState({
    species: '',
    size: '',
    weight: '',
    photo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddCatch = () => {
    if (newCatch.species) {
      setFormData((prev) => ({
        ...prev,
        catches: [...prev.catches, { ...newCatch }],
      }));
      setNewCatch({
        species: '',
        size: '',
        weight: '',
        photo: '',
      });
    }
  };

  const handleRemoveCatch = (index) => {
    setFormData((prev) => ({
      ...prev,
      catches: prev.catches.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mapPosition) {
        formData.location.coordinates = {
          lat: mapPosition[0],
          lng: mapPosition[1],
        };
      }

      await sessions.create(formData);
      navigate('/feed');
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Log New Session</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date and Location */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="input mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location Name</label>
              <input
                type="text"
                name="location.name"
                value={formData.location.name}
                onChange={handleInputChange}
                className="input mt-1"
                placeholder="e.g., North Beach"
                required
              />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Select Location</h2>
          <div className="h-64 rounded-lg overflow-hidden">
            <MapContainer
              center={[0, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker position={mapPosition} setPosition={setMapPosition} />
            </MapContainer>
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Conditions</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Visibility (1-5)</label>
              <input
                type="number"
                name="conditions.visibility"
                value={formData.conditions.visibility}
                onChange={handleInputChange}
                min="1"
                max="5"
                className="input mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Water Temperature (°C)</label>
              <input
                type="number"
                name="conditions.waterTemp"
                value={formData.conditions.waterTemp}
                onChange={handleInputChange}
                className="input mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tide</label>
              <select
                name="conditions.tide"
                value={formData.conditions.tide}
                onChange={handleInputChange}
                className="input mt-1"
                required
              >
                <option value="low">Low</option>
                <option value="rising">Rising</option>
                <option value="high">High</option>
                <option value="falling">Falling</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Weather</label>
              <input
                type="text"
                name="conditions.weather"
                value={formData.conditions.weather}
                onChange={handleInputChange}
                className="input mt-1"
                placeholder="e.g., Sunny, Cloudy"
                required
              />
            </div>
          </div>
        </div>

        {/* Catches */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Catches</h2>
          <div className="space-y-4">
            {formData.catches.map((catch_, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{catch_.species}</p>
                  <p className="text-sm text-gray-500">
                    {catch_.size}cm, {catch_.weight}kg
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCatch(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Species</label>
                <input
                  type="text"
                  value={newCatch.species}
                  onChange={(e) => setNewCatch({ ...newCatch, species: e.target.value })}
                  className="input mt-1"
                  placeholder="e.g., Yellowtail"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Size (cm)</label>
                <input
                  type="number"
                  value={newCatch.size}
                  onChange={(e) => setNewCatch({ ...newCatch, size: e.target.value })}
                  className="input mt-1"
                  placeholder="e.g., 45"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  value={newCatch.weight}
                  onChange={(e) => setNewCatch({ ...newCatch, weight: e.target.value })}
                  className="input mt-1"
                  placeholder="e.g., 2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Photo URL</label>
                <input
                  type="url"
                  value={newCatch.photo}
                  onChange={(e) => setNewCatch({ ...newCatch, photo: e.target.value })}
                  className="input mt-1"
                  placeholder="https://..."
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddCatch}
              className="btn btn-secondary flex items-center justify-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Catch</span>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Notes</h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="input mt-1 h-32"
            placeholder="Add any additional notes about your session..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : 'Save Session'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewSession; 