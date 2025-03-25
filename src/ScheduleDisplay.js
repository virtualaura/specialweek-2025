import React from "react";

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
  const [filter, setFilter] = useState("");
  const [filteredSchedule, setFilteredSchedule] = useState(schedule);
  
  useEffect(() => {
    // Filter schedule based on the selected filter (e.g., name)
    if (filter) {
      setFilteredSchedule(
        schedule.filter((day) =>
          day.blocks.some(
            (block) =>
              (block.who && block.who.includes(filter)) || (block.cc && block.cc.includes(filter))
          )
        )
      );
    } else {
      setFilteredSchedule(schedule); // Reset to original schedule if no filter
    }
  }, [filter, schedule]);

  // Get unique names from the who and cc fields to generate filter buttons
  const getUniqueNames = (schedule) => {
    const names = [];
    schedule.forEach((day) => {
      day.blocks.forEach((block) => {
        if (block.who) {
          names.push(...block.who.split(";"));
        }
        if (block.cc) {
          names.push(...block.cc.split(";"));
        }
      });
    });
    return [...new Set(names)];
  };

  return (
    <div>
      {/* Filter buttons */}
      <div className="filter-buttons">
        {getUniqueNames(schedule).map((name) => (
          <button
            key={name}
            className="mr-2 px-3 py-1 bg-gray-500 text-white rounded"
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
        <button
          className="mr-2 px-3 py-1 bg-gray-500 text-white rounded"
          onClick={() => setFilter("")} // Clear the filter
        >
          All
        </button>
      </div>

      {/* Schedule Display */}
      <div className="schedule-container">
        {filteredSchedule && filteredSchedule.length > 0 ? (
          filteredSchedule.map((day) => (
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
                        className={`schedule-block ${blockColor} p-2 my-1 rounded`}
                        style={{
                          width: `${duration * 100}px`, // Width is based on duration
                          marginBottom: "10px", // Add some spacing between blocks
                        }}
                      >
                        <div className="font-semibold text-white">{block.event}</div>
                        <div className="text-sm text-white">{block.time}</div>
                        <div className="text-xs text-white">{block.location}</div>
                        <div className="text-xs text-white">
                          {block.who && block.who.split(";").join(", ")}
                        </div>
                        <div className="text-xs text-white">
                          {block.cc && block.cc.split(";").join(", ")}
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
    </div>
  );
};

export default ScheduleDisplay;