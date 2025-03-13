const BusRoute = require("../models/BusRoute");

// Get all bus routes
exports.getRoutes = async (req, res) => {
  try {
    const routes = await BusRoute.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new bus route
exports.createRoute = async (req, res) => {
  try {
    const route = new BusRoute(req.body);
    const newRoute = await route.save();
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a bus route
exports.updateRoute = async (req, res) => {
  try {
    const route = await BusRoute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a bus route
exports.deleteRoute = async (req, res) => {
  try {
    const route = await BusRoute.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
