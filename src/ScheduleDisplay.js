import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import './SpecialWeek.css';

const ScheduleDisplay = () => {
  const [scheduleData, setScheduleData] = useState([]);

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

    // Convert to array 
    const processedSchedule = Object.entries(groupedSchedule)
      .map(([day, events]) => ({ day, events }));

    setScheduleData(processedSchedule);
  }, []);

  // Color mapping function
  const getBlockColor = (event) => {
    const colorMap = {
      'Workshop': 'blue',
      'Lunch': 'yellow',
      'Gouter': 'lightyellow',
      'Team Meeting': 'green',
      'Keynote': 'blue',
      'Hackathon': 'red',
      'Pitch Event': 'red'
    };
    return colorMap[event] || 'lightyellow';
  };

  // Convert time to percentage for positioning
  const calculateHeight = (startTime, endTime) => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const totalDayMinutes = 24 * 60;
    
    return {
      height: `${((end - start) / totalDayMinutes) * 100}%`,
      top: `${(start / totalDayMinutes) * 100}%`
    };
  };

  return (
    <div className="schedule-container">
      {scheduleData.map(({ day, events }) => (
        <div key={day} className="schedule-day">
          <div className="schedule-day-name">{day}</div>
          <div className="schedule-bars">
            {events.map((event, index) => {
              const positionStyle = calculateHeight(event.start_time, event.end_time);
              return (
                <div 
                  key={index} 
                  className={`schedule-block ${getBlockColor(event.event)}`}
                  style={positionStyle}
                >
                  <div className="block-content">
                    <div className="event-name">{event.event}</div>
                    <div className="event-time">{`${event.start_time} - ${event.end_time}`}</div>
                    <div className="event-location">{event.location}</div>
                  </div>
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