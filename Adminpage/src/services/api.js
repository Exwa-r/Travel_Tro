/**
 * API service for making requests to the backend
 */

const API_URL = "http://localhost:5000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  // Add any authentication headers if needed
});

export const fetchRoutes = async () => {
  try {
    const response = await fetch(`${API_URL}/routes`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error;
  }
};

export const createRoute = async (routeData) => {
  try {
    const response = await fetch(`${API_URL}/routes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(routeData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating route:", error);
    throw error;
  }
};

export const updateRoute = async (id, routeData) => {
  try {
    const response = await fetch(`${API_URL}/routes/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(routeData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating route:", error);
    throw error;
  }
};

export const deleteRoute = async (id) => {
  try {
    const response = await fetch(`${API_URL}/routes/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting route:", error);
    throw error;
  }
};
