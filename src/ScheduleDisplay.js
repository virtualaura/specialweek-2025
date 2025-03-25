import React, { useState, useEffect } from 'react'; // Add this import line at the top

// Helper function to parse and calculate block duration
const getBlockDuration = (start, end) => {
  const parseTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes; // convert time to total minutes
  };

  const startTimeInMinutes = parseTime(start);
  const endTimeInMinutes = parseTime(end);

  return (endTimeInMinutes - startTimeInMinutes) / 60; // return duration in hours
};

// Helper function to get block color based on the time of day
const getBlockColor = (time) => {
  if (time.includes("Morning")) return "bg-blue-500";
  if (time.includes("Afternoon")) return "bg-green-500";
  if (time.includes("Lunch")) return "bg-yellow-500";
  if (time.includes("Gouter")) return "bg-yellow-100";
  if (time.includes("Evening")) return "bg-red-500";
  return "bg-gray-300"; // Default color
};

const ScheduleDisplay = ({ schedule }) => {
  return (
    <div className="schedule-container">
      {/* Iterate through each day in the schedule */}
      {schedule && schedule.length > 0 ? (
        schedule.map((day) => (
          <div key={day.date} className="schedule-day">
            <div className="schedule-day-name">{day.date}</div>
            <div className="schedule-bars">
              {day.blocks && day.blocks.length > 0 ? (
                day.blocks.map((block, index) => {
                  // Ensure block.start and block.end are defined before processing
                  if (!block.start || !block.end) return null;

                  // Calculate block duration in hours
                  const duration = getBlockDuration(block.start, block.end);
                  const blockColor = getBlockColor(block.time);

                  return (
                    <div
                      key={index}
                      className={`schedule-block ${blockColor}`}
                      style={{
                        height: `${duration * 50}px`, // Scale height by 50px per hour (adjust for proper fit)
                      }}
                    >
                      <div className="block-content">
                        <div className="event-name">{block.event}</div>
                        <div className="event-time">{block.time}</div>
                        <div className="event-location">{block.location}</div>
                        <div className="event-who">{block.who && block.who.split(";").join(", ")}</div>
                        <div className="event-cc">{block.cc && block.cc.split(";").join(", ")}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>No blocks available for this day</div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div>No schedule data available</div>
      )}
    </div>
  );
};

export default ScheduleDisplay;