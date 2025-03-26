import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ScheduleDisplay from "./ScheduleDisplay";
import html2pdf from 'html2pdf.js';

// Helper function to extract unique names from the 'who' and 'cc' fields
const getUniqueNames = (tasks) => {
  const names = new Set();
  tasks.forEach((task) => {
    if (task.who) {
      task.who.forEach((name) => names.add(name.trim()));
    }
    if (task.cc) {
      task.cc.split(";").forEach((name) => names.add(name.trim()));
    }
  });
  return [...names].sort(); // Sort names alphabetically
};

export default function SpecialWeekTodos() {
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [filter, setFilter] = useState(null);
  const [names, setNames] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const generatePDF = async (e) => {
    e.preventDefault();
    try {
      const element = document.getElementById('schedule-block');
      if (!element) {
        console.error('Schedule element not found');
        return;
      }
      const opt = {
        margin: 1,
        filename: 'special-week-schedule.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

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
            due_date: formatDate(task.due_date),
          }));
          setTasks(formattedTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
          setNames(getUniqueNames(formattedTasks));
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
            const formattedDate = formatDate(date);
            let day = acc.find((day) => day.date === formattedDate);
            if (!day) {
              day = { date: formattedDate, blocks: [] };
              acc.push(day);
            }
            day.blocks.push({ time, start, end, event, location });
            return acc;
          }, []);
          setSchedule(formattedSchedule);
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
    return date.toLocaleDateString('en-GB', options);
  };

  // Filter tasks based on the selected filter and special conditions
  const filteredTasks = tasks.filter((task) => {
    // Special case for done status tasks - only show for Laura
    if (task.status === 'done' && filter !== 'Laura') {
      return false;
    }

    // If no filter is selected, show all tasks except done status
    if (!filter) {
      return task.status !== 'done';
    }

    // Check if the task is assigned to or CC'd to the selected person
    const isAssigned = task.who.includes(filter);
    const isCCd = task.cc && task.cc.split(';').includes(filter);
    return isAssigned || isCCd;
  });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="header-container">
        <img 
          src={process.env.PUBLIC_URL + "/rosey-lineaire-quadri.png"} 
          alt="Special Week Logo" 
          className="header-image"
        />
        <h1>Special Week 2025 - Schedule and To-Dos</h1>
      </div>

      {/* Schedule block */}
      <div className="section-header">
        <h2>Schedule</h2>
        <button 
          className="hide-calendar-btn"
          onClick={() => setShowSchedule(!showSchedule)}
        >
          {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
        </button>
      </div>
      <div>
      <h4 id="schedule">
        Clicking the "Show Schedule" button will open up the daily schedule, starting on Tuesday the 13th of May and finishing Friday the 16th of May in the afternoon. If you want a pdf version of the schedule, <a href="">click here </a>.
        </h4>
      </div>
      {showSchedule && (
        <div className="modal-overlay" onClick={() => setShowSchedule(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule</h2>
              <div className="modal-buttons">
                <button className="download-pdf-btn" onClick={generatePDF}>
                  Download PDF
                </button>
                <button className="close-window-btn" onClick={() => setShowSchedule(false)}>
                  Close Window
                </button>
              </div>
            </div>
            <div id="schedule-block" className="my-6">
              <ScheduleDisplay schedule={schedule} />
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Filter buttons */}
      <div className="section-header">
        <h2>To-dos</h2>
      </div>
      <div>
      <h4 id="todos">
        Here is where I need your help 😊. By clicking on the button that shows your name,
        you'll see the information that is relevant for you - either because your feedback is needed (if your name is in the 👤 section), or on an FYI
        basis (📢).
      </h4>
      </div>
      <div className="mb-4">
        <button 
          className={`filter-button ${!filter ? 'active' : ''}`}
          onClick={() => setFilter(null)}
        >
          All
        </button>
        {names.map((name) => (
          <button
            key={name}
            className={`filter-button ${filter === name ? 'active' : ''}`}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Todo list in grid layout */}
      <div className="todo-grid">
        {filteredTasks.map((todo) => (
          <li key={todo.id} className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
            <div className="flex items-center">
              <input
                disabled
                className="mr-3 h-5 w-5 text-blue-500 border-gray-300 rounded"
                type="checkbox"
                checked={todo.status === "done"}
              />
              <span className={`font-semibold text-lg ${todo.status === "done" ? "line-through text-gray-400" : "text-gray-900"}`}>
                {todo.description}
              </span>
            </div>
            <div className="mt-2 ml-8 text-gray-700 text-sm space-y-1">
              {filter === 'Laura' && (
                <div className="todo-detail">
                  <span className="font-semibold text-gray-900">📅</span> {todo.due_date}
                </div>
              )}
              <div className="todo-detail">
                <span className="font-semibold text-gray-900">👤</span> 
                {todo.who ? todo.who.join(", ") : ""}
              </div>
              {todo.cc && (
                <div className="todo-detail">
                  <span className="font-semibold text-gray-900">📢 </span> {todo.cc ? todo.cc.split(";").join(", ") : ""}
                </div>
              )}
              {todo.notes && <div className="todo-detail italic text-gray-600">📝 {todo.notes}</div>}
            </div>
          </li>
        ))}
      </div>
    </div>
  );
}
