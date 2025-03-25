import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Papa from "papaparse";
import ScheduleDisplay from "./ScheduleDisplay";  // Separate component for displaying
import TodoList from "./SpecialWeekTodos.js";
import './App.css';

const App = () => {
  const [schedule, setSchedule] = useState([]);
  
  // Fetch and parse schedule from CSV
  useEffect(() => {
    async function fetchSchedule() {
      const response = await fetch(process.env.PUBLIC_URL + "/schedule.csv");
      const text = await response.text();
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        complete: (result) => {
          const formattedSchedule = result.data.reduce((acc, row) => {
            const { date, time, start, end, event, location } = row;
            
            // Find the day in the accumulator or create a new day if not found
            let day = acc.find((day) => day.date === date);
            if (!day) {
              day = { date, blocks: [] };
              acc.push(day);
            }
            
            // Add the block with the correct format
            day.blocks.push({ time, start, end, event, location });
            return acc;
          }, []);
          
          setSchedule(formattedSchedule);  // Set the formatted schedule state
        }
      });
    }

    fetchSchedule();
  }, []);

  return (
    <div>
      <h1>Welcome to the Event Schedule</h1>

      {/* Schedule Display Block */}
      <div id="schedule-block" className="my-6">
        <ScheduleDisplay schedule={schedule} />
      </div>

      {/* Todo List Block */}
      <div className="my-6">
        <TodoList /> {/* Displaying the TodoList component */}
      </div>
    </div>
  );
};

export default App;