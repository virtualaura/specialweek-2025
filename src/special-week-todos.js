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
      <ul class="list-none">
  {todos.map((todo) => (
    <li class="p-3 border-b last:border-b-0 flex flex-col">
      <div class="flex items-start">
        <input disabled class="mr-2 mt-1" type="checkbox" checked={todo.status === "done"} />
        <div class="font-semibold">{todo.description}</div>
      </div>
      <div class="ml-6">
        <div><span class="font-semibold">What:</span> {todo.description}</div>
        <div><span class="font-semibold">Due Date:</span> {todo.due_date}</div>
        <div><span class="font-semibold">Who:</span> {todo.who}</div>
        <div><span class="font-semibold">For Info:</span> {todo.cc}</div>
        <div><span class="font-semibold">Notes:</span> {todo.notes}</div>
      </div>
    </li>
  ))}
</ul>
    </div>
  );
}
