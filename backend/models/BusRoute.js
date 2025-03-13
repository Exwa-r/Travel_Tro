const mongoose = require("mongoose");

const busRouteSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    fare: {
      type: String,
      required: true,
    },
    stops: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BusRoute", busRouteSchema);
