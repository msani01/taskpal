"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";

const Page = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tasks] = useState([
    {
      id: 1,
      title: "Finish UI design",
      status: "Pending",
      due: "2025-07-25",
    },
    {
      id: 2,
      title: "Submit report",
      status: "Completed",
      due: "2025-07-24",
    },
    {
      id: 3,
      title: "Fix login bug",
      status: "Pending",
      due: "2025-07-26",
    },
    {
      id: 4,
      title: "Team meeting prep",
      status: "Pending",
      due: "2025-07-23",
    },
  ]);

  const today = new Date("2025-07-25");

  const getStatusCounts = () => {
    let todayCount = 0,
      overdue = 0,
      completed = 0;

    tasks.forEach((task) => {
      const dueDate = new Date(task.due);
      if (task.status === "Completed") completed++;
      if (task.status === "Pending" && dueDate.toDateString() === today.toDateString())
        todayCount++;
      if (task.status === "Pending" && dueDate < today) overdue++;
    });

    return { todayCount, overdue, completed };
  };

  const { todayCount, overdue, completed } = getStatusCounts();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-gray-50 to-blue-100 relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 bg-white p-4 shadow-md">
        <Link href="/">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">TaskPal</h2>
        </Link>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="text-blue-600 font-semibold">
            Dashboard
          </Link>
          <Link href="/mytasks" className="text-gray-800 hover:text-blue-600">
            My Tasks
          </Link>
          <Link href="#" className="text-gray-800 hover:text-blue-600">
            Calendar
          </Link>
          <Link href="#" className="text-gray-800 hover:text-blue-600">
            Settings
          </Link>
        </nav>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-4 transform transition-transform z-40
           md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link href={"/"}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">TaskPal</h2>
        </Link>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="text-blue-600 font-semibold" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/mytasks" className="text-gray-800 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
            My Tasks
          </Link>
          <Link href="#" className="text-gray-800 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
            Calendar
          </Link>
          <Link href="#" className="text-gray-800 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
            Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <main className="w-full p-4 sm:p-6 flex flex-col space-y-6">
        {/* Search Bar */}
        <div className="flex justify-between items-center gap-3 md:gap-6 mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-grow px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          />
          {/* Menu Icon for mobile */}
          <button
            className="md:hidden p-2 bg-gray-800 rounded text-white shadow-md"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <IoMdMenu size={24} />
          </button>
        </div>


        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Tasks Due Today</p>
            <h3 className="text-2xl font-semibold text-amber-500">{todayCount}</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Overdue</p>
            <h3 className="text-2xl font-semibold text-red-500">{overdue}</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Completed</p>
            <h3 className="text-2xl font-semibold text-green-500">{completed}</h3>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold text-gray-800">Upcoming Tasks</h4>

            {/* Desktop Add Task Button */}
            <Link href="/addtasks" className="hidden md:block">
              <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm 
              px-4 py-2 rounded-md">
                <span className="mr-2 text-lg font-bold">+</span> New Task
              </button>
            </Link>

            {/* Mobile Add Task Icon */}
            <Link href="/addtasks" className="block md:hidden">
              <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <FiPlus size={20} />
              </button>
            </Link>
          </div>

          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-3 bg-white rounded-lg shadow-sm flex justify-between items-center"
              >
                <span className="text-gray-700 font-medium">{task.title}</span>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : new Date(task.due) < today
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Task Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">Total Tasks: {tasks.length}</p>
            <p className="text-gray-600">Pending: {tasks.filter((t) => t.status === "Pending").length}</p>
            <p className="text-gray-600">Completed: {completed}</p>
            <p className="text-gray-600">Overdue: {overdue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">Next Due Task:</p>
            <p className="font-medium text-blue-700 mt-2">
              {
                tasks
                  .filter((t) => t.status === "Pending")
                  .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())[0]?.title || "None"
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
