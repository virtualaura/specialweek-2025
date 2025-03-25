import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ScheduleDisplay from "./ScheduleDisplay"; // Import ScheduleDisplay

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(null);
  const [schedule, setSchedule] = useState([]);  // Add state for schedule

  // Fetch and parse tasks from CSV
  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch(process.env.PUBLIC_URL + "/tasks.csv");
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        complete: (result) => {
          setTasks(result.data.map(task => ({
            ...task,
            who: task.who.split(";")
          })));
        }
      });
    }
    fetchTasks();
  }, []);

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
          // Organize schedule data by day and blocks
          const formattedSchedule = result.data.reduce((acc, row) => {
            const { date, time, start, end, event, location } = row;

            let day = acc.find((day) => day.date === date);
            if (!day) {
              day = { date, blocks: [] };
              acc.push(day);
            }

            day.blocks.push({ time, start, end, event, location });
            return acc;
          }, []);

          setSchedule(formattedSchedule);  // Update schedule state
        }
      });
    }
    fetchSchedule();
  }, []);

  const filteredTasks = filter ? tasks.filter(task => task.who.includes(filter)) : tasks;

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Intro Text */}
      <h1 className="text-xl font-bold mb-4">Special Week 2025 - Plan and To-Dos</h1>
      <h3>
        Below please find details for Special Week 2025 planning. In the first block, you'll see the calendar for the week.
        The second section has the to-dos that need to be completed for the week. By clicking on your name, you'll see the
        information that is relevant for you - either because your feedback is needed, or on a FYI basis.
      </h3>

      {/* Display the calendar / schedule */}
      <div id="schedule-block" className="my-6">
        <ScheduleDisplay schedule={schedule} />
      </div>

      {/* To-Dos List */}
      <div className="mb-4">
        <button className="mr-2 px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setFilter(null)}>All</button>
        <button className="mr-2 px-3 py-1 bg-gray-500 text-white rounded" onClick={() => setFilter("Kim")}>Kim</button>
        <button className="px-3 py-1 bg-gray-500 text-white rounded" onClick={() => setFilter("Julia")}>Julia</button>
      </div>
      
      {/* Tasks Table */}
      <ul className="list-none space-y-4">
        {filteredTasks.map((todo) => (
          <li key={todo.id} className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
            <div className="flex items-center">
              <input 
                disabled 
                className="mr-3 h-5 w-5 text-blue-500 border-gray-300 rounded" 
                type="checkbox" 
                checked={todo.status === "done"} 
              />
              <div className={`font-semibold text-lg ${todo.status === "done" ? "line-through text-gray-400" : "text-gray-900"}`}>
                {todo.description}
              </div>
            </div>
            <div className="mt-2 ml-8 text-gray-700 text-sm space-y-1">
              <div><span className="font-semibold text-gray-900">📅 Due Date:</span> {todo.due_date}</div>
              <div><span className="font-semibold text-gray-900">👤 Who:</span> {todo.who ? todo.who.join(", ") : ""}</div>
              {todo.cc && <div><span className="font-semibold text-gray-900">📢 For Info:</span> {todo.cc}</div>}
              {todo.notes && <div className="italic text-gray-600">📝 {todo.notes}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
