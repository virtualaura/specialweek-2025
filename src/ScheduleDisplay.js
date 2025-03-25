import React, { useState, useEffect } from 'react';

const ScheduleDisplay = () => {
  const [scheduleData, setScheduleData] = useState([]);

  // Helper function to parse and calculate block duration
  const getBlockDuration = (start, end) => {
    const parseTime = (time) => {
      const [hours, minutes] = time.trim().split(":").map(Number);
      return hours * 60 + minutes; // convert time to total minutes
    };
    const startTimeInMinutes = parseTime(start);
    const endTimeInMinutes = parseTime(end);
    return endTimeInMinutes - startTimeInMinutes; // return duration in minutes
  };

  // Helper function to get block color based on the event type
  const getBlockColor = (event) => {
    const colorMap = {
      'Workshop': 'bg-blue-500',
      'Lunch': 'bg-yellow-500',
      'Gouter': 'bg-yellow-200',
      'Team Meeting': 'bg-green-500',
      'Keynote': 'bg-purple-500',
      'Hackathon': 'bg-red-500',
      'Pitch Event': 'bg-orange-500',
      'Evening': 'bg-indigo-500'
    };
    return colorMap[event] || 'bg-gray-300';
  };

  useEffect(() => {
    // Directly parse the CSV string
    const csvText = `day,period,start_time,end_time,event,location
Tuesday, Morning1, 08:40, 10:10, Workshop, on-site
Tuesday, Gouter, 10:10, 10:30, Gouter, on-site
Tuesday, Morning2, 10:30, 12:30, Workshop, on-site
Tuesday, Lunch, 12:30, 13:30, Lunch, on-site
Tuesday, Afternoon, 13:30, 17:00, Team Meeting, on-site
Wednesday, Morning2, 10:30, 12:00, Keynote, on-site
Thursday, Gouter, 10:10, 10:30, Gouter, on-site
Thursday, Evening, 17:00, 22:00, Hackathon, on-site
Friday, Gouter, 10:10, 10:30, Gouter, on-site
Friday, Afternoon, 14:00, 17:00, Pitch Event, on-site`;

    // Parse CSV manually
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const parsedData = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });

    // Group by day
    const groupedSchedule = {};
    parsedData.forEach(row => {
      if (!groupedSchedule[row.day]) {
        groupedSchedule[row.day] = [];
      }
      groupedSchedule[row.day].push(row);
    });

    // Convert grouped schedule to array
    const processedSchedule = Object.entries(groupedSchedule).map(([day, events]) => ({
      day,
      events
    }));

    setScheduleData(processedSchedule);
  }, []);

  // Calculate the time of the first and last events across all days
  const calculateTimeRange = () => {
    let earliestTime = Infinity;
    let latestTime = -Infinity;

    scheduleData.forEach(({ events }) => {
      events.forEach(event => {
        const startMinutes = getBlockDuration('00:00', event.start_time);
        const endMinutes = getBlockDuration('00:00', event.end_time);
        earliestTime = Math.min(earliestTime, startMinutes);
        latestTime = Math.max(latestTime, endMinutes);
      });
    });

    return { earliestTime, latestTime };
  };

  // Calculate total minutes in the day
  const { earliestTime = 0, latestTime = 1440 } = scheduleData.length > 0 ? calculateTimeRange() : {};
  const TOTAL_DAY_MINUTES = latestTime - earliestTime;

  return (
    <div className="flex w-full h-screen p-4 space-x-4 overflow-x-auto">
      {scheduleData.map(({ day, events }) => (
        <div key={day} className="flex-1 min-w-[200px] border rounded shadow-lg">
          <div className="text-center font-bold p-2 bg-gray-200">{day}</div>
          <div className="relative h-full p-2">
            {events.map((event, index) => {
              const duration = getBlockDuration(event.start_time, event.end_time);
              const startMinutes = getBlockDuration('00:00', event.start_time) - earliestTime;
              
              return (
                <div 
                  key={index} 
                  className={`absolute w-full ${getBlockColor(event.event)} text-black p-2 rounded mb-1`}
                  style={{
                    height: `${(duration / TOTAL_DAY_MINUTES) * 100}%`,
                    top: `${(startMinutes / TOTAL_DAY_MINUTES) * 100}%`
                  }}
                >
                  <div className="font-semibold text-sm">{event.event}</div>
                  <div className="text-xs">{`${event.start_time} - ${event.end_time}`}</div>
                  <div className="text-xs">{event.location}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleDisplay;