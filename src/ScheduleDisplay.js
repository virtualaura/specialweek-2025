import React from "react";

const ScheduleDisplay = ({ schedule }) => {
  // Set the scale factor for the block height based on time (e.g., 1 hour = 25px)
  const scaleFactor = 25;

  // Helper function to calculate the duration of an event
  const calculateHeight = (start, end) => {
    const startTime = new Date(`1970-01-01T${start}:00Z`).getTime();
    const endTime = new Date(`1970-01-01T${end}:00Z`).getTime();
    const duration = (endTime - startTime) / (1000 * 60 * 60); // Duration in hours
    return duration * scaleFactor; // Scale by factor (e.g., 25px per hour)
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {/* Map through the schedule, grouped by day */}
      {schedule.map((day) => (
        <div key={day.date} style={{ flex: 1, padding: "0 10px" }}>
          <h3>{day.date}</h3>
          <div style={{ position: "relative", paddingTop: "10px" }}>
            {day.blocks.map((block, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  top: calculateHeight("00:00", block.start), // Position based on start time
                  height: calculateHeight(block.start, block.end), // Height based on duration
                  left: 0,
                  right: 0,
                  padding: "5px",
                  backgroundColor: getBlockColor(block.event), // Dynamic color based on event type
                  borderRadius: "5px",
                  color: "white",
                  zIndex: index + 1, // Ensure blocks stack correctly
                }}
              >
                <div className="font-semibold">{block.event}</div>
                <div className="text-sm">{block.time}</div>
                <div className="text-xs">{block.location}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to get the background color for each event
const getBlockColor = (event) => {
  switch (event) {
    case "Workshop":
      return "#3498db"; // Blue
    case "Gouter":
      return "#f1c40f"; // Yellow
    case "Lunch":
      return "#e67e22"; // Orange
    case "Team Meeting":
      return "#2ecc71"; // Green
    case "Keynote":
      return "#9b59b6"; // Purple
    case "Hackathon":
      return "#e74c3c"; // Red
    case "Pitch Event":
      return "#16a085"; // Teal
    default:
      return "#bdc3c7"; // Grey for undefined events
  }
};

export default ScheduleDisplay;
