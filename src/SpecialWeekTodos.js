import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import './SpecialWeekTodos.css';

const SpecialWeekTodos = () => {
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [filter, setFilter] = useState(null);

  // Fetch tasks from CSV
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

  // Fetch schedule from CSV
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

            let day = acc.find((day) => day.date === date);
            if (!day) {
              day = { date, blocks: [] };
              acc.push(day);
            }

            day.blocks.push({ time, start, end, event, location });
            return acc;
          }, []);
          setSchedule(formattedSchedule);
        }
      });
    }

    fetchSchedule();
  }, []);

  // Filter tasks by a name
  const filteredTasks = filter ? tasks.filter(task => task.who.includes(filter)) : tasks;

  // Event block colors based on time of day
  const timeOfDayColor = (timeSlot) => {
    const morningTimes = ["Morning1", "Morning2"];
    const afternoonTimes = ["Afternoon"];
    const lunchTimes = ["Lunch"];
    const breakTimes = ["Break"];
    const eveningTimes = ["Evening"];

    if (morningTimes.includes(timeSlot)) return "bg-blue-500";
    if (afternoonTimes.includes(timeSlot)) return "bg-yellow-500";
    if (lunchTimes.includes(timeSlot)) return "bg-green-500";
    if (breakTimes.includes(timeSlot)) return "bg-gray-500";
    if (eveningTimes.includes(timeSlot)) return "bg-red-500";
    return "bg-white"; // Default color
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Special Week 2025 - Plan and To-Dos</h1>
      <h3>
        Below please find details for Special Week 2025 planning. In the first block,
        you'll see the calendar for the week. The second section has the to-dos that need
        to be completed for the week. By clicking on your name, you'll see the information
        that is relevant for you.
      </h3>

      {/* Calendar Display */}
      <div id="schedule-block" className="my-6">
        <h2 className="text-lg font-semibold">Weekly Schedule</h2>
        <div className="schedule-container">
          {schedule.map((day, index) => (
            <div key={index} className="schedule-day">
              <h3 className="text-center">{day.date}</h3>
              <div className="schedule-bars">
                {["Morning1", "Break", "Morning2", "Lunch", "Afternoon", "Evening"].map((slot) => {
                  const block = day.blocks.find((b) => b.time === slot);
                  return (
                    <div key={slot} className={`schedule-block ${timeOfDayColor(slot)}`}>
                      {block && (
                        <div className="event-text">
                          <span>{block.event}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* To-Do List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">To-Do List</h2>
        <div className="filter-buttons mb-4">
          <button className="mr-2 px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setFilter(null)}>All</button>
          <button className="mr-2 px-3 py-1 bg-gray-500 text-white rounded" onClick={() => setFilter("Kim")}>Kim</button>
          <button className="px-3 py-1 bg-gray-500 text-white rounded" onClick={() => setFilter("Julia")}>Julia</button>
        </div>
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
                <div>
                 <span className="font-semibold text-gray-900">👤 Who:</span> 
                  {todo.who ? String(todo.who).split(";").join(", ") : ""}
                </div>
                {todo.cc && <div><span className="font-semibold text-gray-900">📢 For Info:</span> {todo.cc}</div>}
                {todo.notes && <div className="italic text-gray-600">📝 {todo.notes}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SpecialWeekTodos;
