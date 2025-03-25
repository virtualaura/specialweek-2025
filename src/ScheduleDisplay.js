import React, { useState, useEffect } from 'react';

const ScheduleDisplay = () => {
  const [scheduleData, setScheduleData] = useState([]);

  // Debug logging function
  const logData = (data) => {
    console.log('Parsed Schedule Data:', JSON.stringify(data, null, 2));
    return data;
  };

  useEffect(() => {
    // Directly create the data structure
    const rawData = [
      { day: 'Tuesday', start_time: '08:40', end_time: '10:10', event: 'Workshop', location: 'on-site' },
      { day: 'Tuesday', start_time: '10:10', end_time: '10:30', event: 'Gouter', location: 'on-site' },
      { day: 'Tuesday', start_time: '10:30', end_time: '12:30', event: 'Workshop', location: 'on-site' },
      { day: 'Tuesday', start_time: '12:30', end_time: '13:30', event: 'Lunch', location: 'on-site' },
      { day: 'Tuesday', start_time: '13:30', end_time: '17:00', event: 'Team Meeting', location: 'on-site' },
      { day: 'Wednesday', start_time: '08:40', end_time: '10:10', event: 'Workshop', location: 'on-site' },
      { day: 'Wednesday', start_time: '10:10', end_time: '10:30', event: 'Gouter', location: 'on-site' },
      { day: 'Wednesday', start_time: '10:30', end_time: '12:00', event: 'Keynote', location: 'on-site' },
      { day: 'Thursday', start_time: '08:40', end_time: '10:10', event: 'Workshop', location: 'on-site' },
      { day: 'Thursday', start_time: '10:10', end_time: '10:30', event: 'Gouter', location: 'on-site' },
      { day: 'Thursday', start_time: '17:00', end_time: '22:00', event: 'Hackathon', location: 'on-site' },
      { day: 'Friday', start_time: '08:40', end_time: '10:10', event: 'Workshop', location: 'on-site' },
      { day: 'Friday', start_time: '10:10', end_time: '10:30', event: 'Gouter', location: 'on-site' },
      { day: 'Friday', start_time: '14:00', end_time: '17:00', event: 'Pitch Event', location: 'on-site' }
    ];

    // Group by day
    const groupedSchedule = rawData.reduce((acc, event) => {
      if (!acc[event.day]) {
        acc[event.day] = [];
      }
      acc[event.day].push(event);
      return acc;
    }, {});

    // Convert to array and log
    const processedSchedule = Object.entries(groupedSchedule)
      .map(([day, events]) => ({ day, events }))
      .map(logData);

    setScheduleData(processedSchedule);
  }, []);

  // Time to minutes conversion
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Color mapping
  const getBlockColor = (event) => {
    const colorMap = {
      'Workshop': 'bg-blue-500',
      'Lunch': 'bg-yellow-500',
      'Gouter': 'bg-yellow-200',
      'Team Meeting': 'bg-green-500',
      'Keynote': 'bg-purple-500',
      'Hackathon': 'bg-red-500',
      'Pitch Event': 'bg-orange-500'
    };
    return colorMap[event] || 'bg-gray-300';
  };

  return (
    <div className="flex w-full h-screen p-4 space-x-4 overflow-x-auto">
      {scheduleData.map(({ day, events }) => (
        <div key={day} className="flex-1 border rounded shadow-lg">
          <div className="text-center font-bold p-2 bg-gray-200">{day}</div>
          <div className="relative h-[600px]">
            {events.map((event, index) => {
              const startMinutes = timeToMinutes(event.start_time);
              const endMinutes = timeToMinutes(event.end_time);
              const duration = endMinutes - startMinutes;

              return (
                <div 
                  key={index}
                  className={`absolute w-full ${getBlockColor(event.event)} text-white p-2`}
                  style={{
                    height: `${(duration / (24 * 60)) * 100}%`,
                    top: `${(startMinutes / (24 * 60)) * 100}%`
                  }}
                >
                  <div className="text-sm">{event.event}</div>
                  <div className="text-xs">{`${event.start_time} - ${event.end_time}`}</div>
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