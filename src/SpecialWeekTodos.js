import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ScheduleDisplay from "./ScheduleDisplay";

// Helper function to extract unique names from the 'who' and 'cc' fields
const getUniqueNames = (tasks) => {
  const names = new Set();
  tasks.forEach((task) => {
    if (task.who) {
      task.who.forEach((name) => names.add(name.trim())); // Add each unique 'who' name
    }
    if (task.cc) {
      task.cc.split(";").forEach((name) => names.add(name.trim())); // Add each unique 'cc' name
    }
  });
  return [...names];
};

export default function SpecialWeekTodos() {
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [filter, setFilter] = useState(null);
  const [names, setNames] = useState([]);

  useEffect(() => {
    // Fetch and parse tasks CSV
    async function fetchTasks() {
      const response = await fetch(process.env.PUBLIC_URL + "/tasks.csv");
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        complete: (result) => {
          const formattedTasks = result.data.map((task) => ({
            ...task,
            who: task.who.split(";"),
            due_date: formatDate(task.due_date),  // Format the date
          }));
          setTasks(formattedTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))); // Sort tasks by date
          setNames(getUniqueNames(formattedTasks)); // Extract unique names for the filter buttons
        },
      });
    }

    // Fetch and parse schedule CSV
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

            // Format date and time
            const formattedDate = formatDate(date);
            let day = acc.find((day) => day.date === formattedDate);
            if (!day) {
              day = { date: formattedDate, blocks: [] };
              acc.push(day);
            }

            day.blocks.push({ time, start, end, event, location });

            return acc;
          }, []);
          
          setSchedule(formattedSchedule);  // Set the schedule state here
        },
      });
    }

    fetchTasks();
    fetchSchedule();
  }, []);

  // Helper function to format dates
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // Format as "30 April 2025"
  };

  // Filter tasks based on the selected filter
  const filteredTasks = filter ? tasks.filter((task) => task.who.includes(filter)) : tasks;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Special Week 2025 - Schedule and To-Dos</h1>
      <h4>
        Below please find details for Special Week 2025 planning. In the first block, you'll see the calendar for
        the week, startung on Tuesday the 13th of May in the morning and finishing Friday the 16th of May in the afternoon. 
        <br/><br/>
        The second block has the to-dos that need to be completed for the week. By clicking on the button below the calendar that shows your name,
        you'll see the information that is relevant for you - either because your feedback is needed (if your name is in the 👤 section), or on an FYI
        basis (📢).
      </h4>

      {/* Schedule block */}
      <div id="schedule-block" className="my-6">
        <ScheduleDisplay schedule={schedule} /> {/* Pass the schedule to ScheduleDisplay */}
      </div>

      {/* Dynamic Filter buttons */}
      <div className="mb-4">
        <button className="mr-2 px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setFilter(null)}>
          All
        </button>
        {names.map((name) => (
          <button
            key={name}
            className="mr-2 px-3 py-1 bg-gray-500 text-white rounded"
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <ul className="list-none space-y-4">
        {filteredTasks.map((todo) => (
          <li key={todo.id} className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
            <div className="flex items-center">
              {/* Checkbox and Description on the same line */}
              <input
                disabled
                className="mr-3 h-5 w-5 text-blue-500 border-gray-300 rounded"
                type="checkbox"
                checked={todo.status === "done"}
              />
              <span className={`font-semibold text-lg ${todo.status === "done" ? "line-through text-gray-400" : "text-gray-900"}`}>
                &nbsp;{todo.description}
              </span>
            </div>
            <div className="mt-2 ml-8 text-gray-700 text-sm space-y-1">
              {/* Date, Who, Notes */}
              <div className="todo-detail">
                <span className="font-semibold text-gray-900">📅</span> {todo.due_date}
              </div>
              <div className="todo-detail">
                <span className="font-semibold text-gray-900">👤</span> 
                {todo.who ? todo.who.join(" ") : ""} {/* Add space between names */}
              </div>
              {todo.cc && (
                <div className="todo-detail">
                  <span className="font-semibold text-gray-900">📢 </span> {todo.cc ? todo.cc.split(";").join(" ") : ""}
                </div>
              )}
              {todo.notes && <div className="todo-detail italic text-gray-600">📝 {todo.notes}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
