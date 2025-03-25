import React from "react";

const ScheduleDisplay = ({ schedule }) => {
  // Helper function to calculate the time difference in hours
  const getBlockDuration = (start, end) => {
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    return (endTime - startTime) / 3600000; // Convert milliseconds to hours
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

  return (
    <div className="schedule-container">
      {schedule && schedule.length > 0 ? (
        schedule.map((day) => (
          <div key={day.date} className="schedule-day">
            <div className="schedule-day-name">{day.date}</div>
            <div className="schedule-bars">
              {day.blocks && day.blocks.length > 0 ? (
                day.blocks.map((block, index) => {
                  // Calculate the block's duration in hours
                  const duration = getBlockDuration(block.start, block.end);
                  const blockColor = getBlockColor(block.time);

                  return (
                    <div
                      key={index}
                      className={`schedule-block ${blockColor} p-2 my-1 rounded`}
                      style={{ width: `${duration * 100}px` }} // Width is based on duration
                    >
                      <div className="font-semibold text-white">{block.event}</div>
                      <div className="text-sm text-white">{block.time}</div>
                      <div className="text-xs text-white">{block.location}</div>
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
