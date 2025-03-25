import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(null);

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

  const filteredTasks = filter ? tasks.filter(task => task.who.includes(filter)) : tasks;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">To-Do List</h1>
      <div className="mb-4">
        <button className="mr-2 px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setFilter(null)}>All</button>
        <button className="mr-2 px-3 py-1 bg-gray-500 text-white rounded" onClick={() => setFilter("Kim")}>Kim</button>
        <button className="px-3 py-1 bg-gray-500 text-white rounded" onClick={() => setFilter("Julia")}>Julia</button>
      </div>
      <ul className="border p-4 rounded bg-gray-100">
        {filteredTasks.map((task, index) => (
          <li key={index} className="p-2 border-b last:border-b-0 flex items-center">
            <input type="checkbox" checked={task.status === "done"} disabled className="mr-2" />
            <div>
              <div className="font-semibold">{task.description} (Due: {task.due_date})</div>
              <div className="text-sm text-gray-600">Assigned: {task.who.join(", ")}</div>
              <div className="text-xs italic">{task.notes}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
