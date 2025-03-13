import { useState, useEffect } from "react";
import {
  fetchRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../services/api";

const BusManagement = () => {
  const [busRoutes, setBusRoutes] = useState([]);
  const [editingRoute, setEditingRoute] = useState(null);
  const [currentStop, setCurrentStop] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: "",
    startTime: "",
    endTime: "",
    frequency: "",
    fare: "",
    stops: [],
  });

  // Fetch bus routes from the backend when component mounts
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        const data = await fetchRoutes();
        setBusRoutes(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch routes:", err);
        setError("Failed to load bus routes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStop = () => {
    if (currentStop.trim()) {
      setFormData((prev) => ({
        ...prev,
        stops: [...prev.stops, currentStop.trim()],
      }));
      setCurrentStop("");
    }
  };

  const handleRemoveStop = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newRoute = {
        ...formData,
        fare: formData.fare.startsWith("₹")
          ? formData.fare
          : `₹${formData.fare}`,
      };

      if (editingRoute !== null) {
        // Update existing route
        const updatedRoute = await updateRoute(
          busRoutes[editingRoute]._id,
          newRoute
        );
        setBusRoutes((prev) =>
          prev.map((route) =>
            route._id === updatedRoute._id ? updatedRoute : route
          )
        );
        setEditingRoute(null);
      } else {
        // Create new route
        const savedRoute = await createRoute(newRoute);
        setBusRoutes((prev) => [...prev, savedRoute]);
      }

      // Reset form
      setFormData({
        busNumber: "",
        startTime: "",
        endTime: "",
        frequency: "",
        fare: "",
        stops: [],
      });
      setCurrentStop("");
      setError(null);
    } catch (err) {
      console.error("Failed to save route:", err);
      setError("Failed to save bus route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const route = busRoutes[index];
    setFormData({
      ...route,
    });
    setEditingRoute(index);
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        setLoading(true);
        const routeId = busRoutes[index]._id;
        await deleteRoute(routeId);
        setBusRoutes((prev) => prev.filter((_, i) => i !== index));
        setError(null);
      } catch (err) {
        console.error("Failed to delete route:", err);
        setError("Failed to delete bus route. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-cyan-500 to-blue-500 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Bus Route Management
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingRoute !== null ? "Edit Route" : "Add New Route"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bus Number
                </label>
                <input
                  type="text"
                  name="busNumber"
                  value={formData.busNumber}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="text"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 6:00 AM"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="text"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 10:00 PM"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <input
                  type="text"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  placeholder="e.g. Every 15 mins"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fare
                </label>
                <input
                  type="text"
                  name="fare"
                  value={formData.fare}
                  onChange={handleInputChange}
                  placeholder="e.g. ₹25"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Add Stops
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentStop}
                    onChange={(e) => setCurrentStop(e.target.value)}
                    placeholder="Enter a stop"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddStop}
                    className="mt-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Stop
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.stops.map((stop, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1"
                    >
                      <span>{stop}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {formData.stops.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    No stops added yet. Add at least one stop.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              {editingRoute !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingRoute(null);
                    setFormData({
                      busNumber: "",
                      startTime: "",
                      endTime: "",
                      frequency: "",
                      fare: "",
                      stops: [],
                    });
                    setCurrentStop("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Loading...</span>
                ) : editingRoute !== null ? (
                  "Update Route"
                ) : (
                  "Add Route"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading && busRoutes.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Loading bus routes...</p>
            </div>
          ) : busRoutes.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                No bus routes found. Add your first route above.
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bus Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fare
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stops
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {busRoutes.map((route, index) => (
                  <tr key={route._id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {route.busNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {route.startTime} - {route.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {route.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {route.fare}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-h-20 overflow-y-auto">
                        {route.stops.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(index)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-900 mr-3 disabled:text-blue-300 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusManagement;
