import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import './SpecialWeek.css';

const ScheduleDisplay = () => {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    // Directly create the data structure
    const rawData = [
      { day: 'Tuesday', start_time: '08:40', end_time: '10:10', event: 'Introduction and Planning', location: 'on-site' },
      { day: 'Tuesday', start_time: '10:10', end_time: '10:30', event: 'Gouter', location: 'on-site' },
      { day: 'Tuesday', start_time: '10:30', end_time: '12:30', event: 'Team Work', location: 'on-site' },
      { day: 'Tuesday', start_time: '12:30', end_time: '13:30', event: 'Lunch', location: 'on-site' },
      { day: 'Tuesday', start_time: '13:30', end_time: '15:30', event: 'Team Work', location: 'on-site' },
      { day: 'Wednesday', start_time: '08:40', end_time: '13:30', event: 'Interviews & Box Lunch', location: 'off-site' },
      { day: 'Wednesday', start_time: '13:30', end_time: '15:30', event: 'Team Work', location: 'on-site' },
      { day: 'Thursday', start_time: '08:40', end_time: '10:10', event: 'Team Work', location: 'on-site' },
      { day: 'Thursday', start_time: '10:10', end_time: '10:30', event: 'Gouter', location: 'on-site' },
      { day: 'Thursday', start_time: '10:30', end_time: '12:30', event: 'Team Work', location: 'on-site' },
      { day: 'Thursday', start_time: '12:30', end_time: '13:30', event: 'Lunch', location: 'on-site' },
      { day: 'Thursday', start_time: '13:30', end_time: '15:30', event: 'Team Work', location: 'on-site' },
      { day: 'Thursday', start_time: '17:00', end_time: '22:00', event: 'Hackathon', location: 'on-site' },
      { day: 'Friday', start_time: '08:40', end_time: '10:10', event: 'Team Work', location: 'on-site' },
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
      'Team Work': 'blue',
      'Lunch': 'yellow',
      'Gouter': 'yellow',
      'Interviews & Box Lunch': 'green',
      'Keynote': 'blue',
      'Hackathon': 'pink',
      'Pitch Event': 'red'
    };
    return colorMap[event] || 'lightyellow';
  };

  // Convert time to pixel height with improved scaling
  const calculateHeight = (startTime, endTime, isHackathon = false) => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const duration = end - start;

    // Base minimum block height
    const minBlockHeight = 40;
    // Scaling factor
    const pixelsPerQuarter = 10;
    // Ensure minimum height while scaling
    const calculatedHeight = Math.max(
      minBlockHeight, 
      Math.min(
        (duration / 15) * pixelsPerQuarter,
        isHackathon ? 3.5 * 60 * (pixelsPerQuarter / 15) : Infinity
      )
    );

    return {
      height: `${calculatedHeight}px`,
      top: `${((start - 8.5 * 60) / 15) * pixelsPerQuarter}px`
    };
  };

  return (
    <div className="schedule-container">
      {scheduleData.map(({ day, events }) => (
        <div key={day} className="schedule-day">
          <div className="schedule-day-name">{day}</div>
          <div className="schedule-bars">
            {events.map((event, index) => {
              const positionStyle = calculateHeight(
                event.start_time, 
                event.end_time, 
                event.event === 'Hackathon'
              );
              return (
                <div 
                  key={index} 
                  className={`schedule-block ${getBlockColor(event.event)}`}
                  style={positionStyle}
                >
                  <div className="block-content">
                    <div className="event-name">
                      {event.start_time} - {event.end_time} <strong>{event.event}</strong>
                    </div>
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