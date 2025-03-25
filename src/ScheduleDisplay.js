// ScheduleDisplay.js
import React from "react";

const ScheduleDisplay = ({ schedule }) => {

  console.log(schedule); // Log the data for debugging
  
  return (
    <div className="schedule-container">
      {schedule && schedule.length > 0 ? (
        schedule.map((day) => (
          <div key={day.date} className="schedule-day">
            <div className="schedule-day-name">{day.date}</div>
            <div className="schedule-bars">
              {day.blocks && Array.isArray(day.blocks) && day.blocks.length > 0 ? (
                day.blocks.map((block, index) => {
                  // Calculate block width based on start and end times
                  const startTime = new Date(`1970-01-01T${block.start}`);
                  const endTime = new Date(`1970-01-01T${block.end}`);
                  const blockWidth = (endTime - startTime) / 3600000; // Convert to hours

                  // Set the background color based on the time slot
                  let blockColor = "";
                  if (block.time.includes("Morning")) blockColor = "bg-blue-500";
                  if (block.time.includes("Afternoon")) blockColor = "bg-green-500";
                  if (block.time.includes("Lunch")) blockColor = "bg-yellow-500";
                  if (block.time.includes("Evening")) blockColor = "bg-red-500";

                  return (
                    <div
                      key={index}
                      className={`schedule-block ${blockColor}`}
                      style={{ width: `${blockWidth * 100}px` }}
                    >
                      {block.event}
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
