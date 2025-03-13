const express = require("express");
const router = express.Router();
const {
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} = require("z:/Website/Travel_Tro/backend/controllers/busRouteController");

// Middleware to validate route ID
const validateRouteId = (req, res, next) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid route ID format" });
  }
  next();
};

router.get("/", getRoutes);
router.post("/", createRoute);
router.put("/:id", validateRouteId, updateRoute);
router.delete("/:id", validateRouteId, deleteRoute);

module.exports = router;
