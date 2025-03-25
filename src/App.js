import React from "react";
import Papa from "papaparse";
import ScheduleDisplay from "./ScheduleDisplay";  // Separate component for displaying
import TodoList from "./special-week-todos.js";
import './App.css';

const App = () => {
  const [schedule, setSchedule] = useState([]);

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
          
          setSchedule(formattedSchedule);
        }
      });
    }

    fetchSchedule();
  }, []);

  return (
    <div>
      <h1>Welcome to the Event Schedule</h1>
      
      {/* Other components can go here */}

      {/* Display schedule in a specific block */}
      <div id="schedule-block">
        <ScheduleDisplay schedule={schedule} />
      </div>

      {/* You can add other sections or blocks of the page below */}
    </div>
  );
};

export default App;