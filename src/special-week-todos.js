import React from "react";
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
      <ul class="list-none space-y-4">
  {tasks.map((todo) => (
    <li class="p-4 bg-white shadow-md rounded-lg border border-gray-200">
    <div class="flex items-center">
      <input 
        disabled 
        class="mr-3 h-5 w-5 text-blue-500 border-gray-300 rounded" 
        type="checkbox" 
        checked={todo.status === "done"} 
      />
      <div class={`font-semibold text-lg ${todo.status === "done" ? "line-through text-gray-400" : "text-gray-900"}`}>
        {todo.description}
      </div>
    </div>
    <div class="mt-2 ml-8 text-gray-700 text-sm space-y-1">
      <div><span class="font-semibold text-gray-900">📅 Due Date:</span> {todo.due_date}</div>
      <div>
        <span class="font-semibold text-gray-900">👤 Who:</span> {todo.who.split(";").join(", ")}
      </div>
      {todo.cc && <div><span class="font-semibold text-gray-900">📢 For Info:</span> {todo.cc}</div>}
      {todo.notes && <div class="italic text-gray-600">📝 {todo.notes}</div>}
    </div>
  </li>
  ))}
</ul>
    </div>
  );
}
