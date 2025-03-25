import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const ScheduleDisplay = ({ csvData }) => {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        if (!csvData) return;
        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                console.log("Parsed CSV Data:", result.data);
                const formattedData = result.data.map(item => ({
                    day: item.day,
                    period: item.period,
                    startTime: item.start_time,
                    endTime: item.end_time,
                    event: item.event,
                    location: item.location
                })).filter(item => item.day && item.period && item.startTime && item.endTime && item.event && item.location);
                console.log("Formatted Schedule Data:", formattedData);
                setSchedule(formattedData);
            }
        });
    }, [csvData]);

    const groupedByDay = schedule.reduce((acc, entry) => {
        if (!acc[entry.day]) acc[entry.day] = [];
        acc[entry.day].push(entry);
        return acc;
    }, {});

    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            {Object.keys(groupedByDay).map(day => (
                <div key={day} style={{ flex: '1', minWidth: '150px', padding: '10px', border: '1px solid #ccc' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{day}</h3>
                    <div style={{ position: 'relative', height: '200px', background: '#f9f9f9', padding: '5px' }}>
                        {groupedByDay[day].map((entry, index) => (
                            <div key={index} style={{
                                position: 'absolute',
                                width: '100%',
                                padding: '5px',
                                backgroundColor: '#bdc3c7',
                                borderRadius: '5px',
                                color: 'white',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                                fontSize: '12px',
                                top: `${(parseInt(entry.startTime?.split(':')[0]) * 60 + parseInt(entry.startTime?.split(':')[1])) / 10}%`,
                                height: `${(parseInt(entry.endTime?.split(':')[0]) * 60 + parseInt(entry.endTime?.split(':')[1]) - (parseInt(entry.startTime?.split(':')[0]) * 60 + parseInt(entry.startTime?.split(':')[1])))}px`
                            }}>
                                <div className="font-semibold">{entry.event}</div>
                                <div className="text-sm">{entry.period}</div>
                                <div className="text-xs">{entry.location}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ScheduleDisplay;
