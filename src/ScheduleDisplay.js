import React from "react";

// Convert "HH:mm" to minutes since midnight
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Calculate event height (scaled down further)
const calculateHeight = (start, end) => {
  const duration = timeToMinutes(end) - timeToMinutes(start);
  return (duration / 60) * 12; // Adjusted scale factor
};

// Position events properly within the column
const calculateTop = (start) => {
  return (timeToMinutes(start) / 1440) * 400; // Assuming 400px total height
};

// Group events by date
const groupByDate = (schedule) => {
  return schedule.reduce((acc, block) => {
    if (!acc[block.date]) acc[block.date] = [];
    acc[block.date].push(block);
    return acc;
  }, {});
};

const ScheduleDisplay = ({ schedule }) => {
  const groupedSchedule = groupByDate(schedule);
  const dates = Object.keys(groupedSchedule);

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      {dates.map((day) => (
        <div key={day} style={{ flex: 1, minWidth: "150px", padding: "10px", border: "1px solid #ccc" }}>
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>{day}</h3>
          <div style={{ position: "relative", height: "400px", background: "#f9f9f9", padding: "5px" }}>
            {groupedSchedule[day].map((block, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  top: calculateTop(block.start) + "px",
                  height: calculateHeight(block.start, block.end) + "px",
                  width: "100%",
                  padding: "5px",
                  backgroundColor: getBlockColor(block.event),
                  borderRadius: "5px",
                  color: "white",
                  boxSizing: "border-box",
                  textAlign: "center",
                  fontSize: "12px",
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

// Assign colors to event types
const getBlockColor = (event) => {
  const colors = {
    Workshop: "#3498db",
    Gouter: "#f1c40f",
    Lunch: "#e67e22",
    "Team Meeting": "#2ecc71",
    Keynote: "#9b59b6",
    Hackathon: "#e74c3c",
    "Pitch Event": "#16a085",
  };
  return colors[event] || "#bdc3c7";
};

export default ScheduleDisplay;
