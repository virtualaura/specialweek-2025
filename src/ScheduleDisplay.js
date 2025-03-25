// CLAUDE
// import React, { useState, useEffect } from 'react';  
import Papa from 'papaparse';

const ScheduleDisplay = () => {
  const [scheduleData, setScheduleData] = useState([]);

  // Helper function to parse and calculate block duration
  const getBlockDuration = (start, end) => {
    const parseTime = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
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
      'Gouter': 'bg-yellow-100',
      'Team Meeting': 'bg-green-500',
      'Keynote': 'bg-purple-500',
      'Hackathon': 'bg-red-500',
      'Pitch Event': 'bg-orange-500',
      'Evening': 'bg-indigo-500'
    };
    return colorMap[event] || 'bg-gray-300';
  };

  useEffect(() => {
    // Fetch and parse the CSV file
    fetch('/schedule.csv')
      .then(response => response.text())
      .then(csvText => {
        // Parse CSV using Papaparse
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            // Group results by day
            const groupedSchedule = {};
            results.data.forEach(row => {
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
          }
        });
      })
      .catch(error => console.error('Error fetching schedule:', error));
  }, []);

  // Calculate total minutes in a day for percentage height
  const TOTAL_DAY_MINUTES = 24 * 60;

  return (
    <div className="flex w-full h-screen p-4 space-x-4">
      {scheduleData.map(({ day, events }) => (
        <div key={day} className="flex-1 border rounded shadow-lg">
          <div className="text-center font-bold p-2 bg-gray-200">{day}</div>
          <div className="relative h-full p-2">
            {events.map((event, index) => {
              const duration = getBlockDuration(event.start_time, event.end_time);
              const startMinutes = getBlockDuration('00:00', event.start_time);
              
              return (
                <div 
                  key={index} 
                  className={`absolute w-full ${getBlockColor(event.event)} text-white p-2 rounded`}
                  style={{
                    height: `${(duration / TOTAL_DAY_MINUTES) * 100}%`,
                    top: `${(startMinutes / TOTAL_DAY_MINUTES) * 100}%`
                  }}
                >
                  <div className="font-semibold">{event.event}</div>
                  <div className="text-sm">{`${event.start_time} - ${event.end_time}`}</div>
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