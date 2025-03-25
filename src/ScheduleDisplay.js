import React, { useState, useEffect } from 'react';

const ScheduleDisplay = () => {
  const [scheduleData, setScheduleData] = useState([]);

  // Helper function to parse time to minutes
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.trim().split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to get block color based on the event type
  const getBlockColor = (event) => {
    const colorMap = {
      'Workshop': 'bg-blue-500 text-white',
      'Lunch': 'bg-yellow-500 text-black',
      'Gouter': 'bg-yellow-200 text-black',
      'Team Meeting': 'bg-green-500 text-white',
      'Keynote': 'bg-purple-500 text-white',
      'Hackathon': 'bg-red-500 text-white',
      'Pitch Event': 'bg-orange-500 text-white',
      'Evening': 'bg-indigo-500 text-white'
    };
    return colorMap[event] || 'bg-gray-300 text-black';
  };

  useEffect(() => {
    // Parse CSV manually
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

    // Parse CSV
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
      events: events.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time))
    }));

    setScheduleData(processedSchedule);
  }, []);

  // Find the earliest and latest times across all days
  const findTimeRange = () => {
    let earliest = Infinity;
    let latest = -Infinity;

    scheduleData.forEach(({ events }) => {
      events.forEach(event => {
        earliest = Math.min(earliest, timeToMinutes(event.start_time));
        latest = Math.max(latest, timeToMinutes(event.end_time));
      });
    });

    return { earliest, latest };
  };

  // Render the schedule
  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 overflow-x-auto">
        {scheduleData.map(({ day, events }) => (
          <div 
            key={day} 
            className="flex-1 min-w-[200px] border rounded-lg shadow-lg"
          >
            <div className="bg-gray-200 text-center font-bold p-2">{day}</div>
            <div className="relative h-[600px] p-2">
              {events.map((event, index) => {
                const startMinutes = timeToMinutes(event.start_time);
                const endMinutes = timeToMinutes(event.end_time);
                const duration = endMinutes - startMinutes;

                return (
                  <div
                    key={index}
                    className={`absolute w-full ${getBlockColor(event.event)} p-2 rounded mb-1 overflow-hidden`}
                    style={{
                      height: `${(duration / (24 * 60)) * 100}%`,
                      top: `${(startMinutes / (24 * 60)) * 100}%`
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
    </div>
  );
};

export default ScheduleDisplay;