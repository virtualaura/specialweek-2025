import React from "react";

const ScheduleDisplay = ({ schedule }) => {
  return (
    <div className="space-y-6">
      {schedule.map((day) => (
        <div key={day.date} className="p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-700">{day.date}</h2>
          <ul className="mt-2 space-y-2">
            {day.blocks.map((block, index) => (
              <li key={index} className={`p-3 border-l-4 rounded-md ${block.location === "on-site" ? "border-blue-500 bg-white" : "border-green-500 bg-white"}`}>
                <span className="font-semibold">{block.start} - {block.end}:</span> {block.event}
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-200">{block.location}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ScheduleDisplay;
