"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import { db } from "@/lib/firebase.config";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const DashboardContents = ({ session }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!session?.user?.id) return;

      try {
        const q = query(
          collection(db, "tasks"),
          where("userId", "==", session.user.id)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [session]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCounts = {
    todayCount: filteredTasks.filter(
      (t) =>
        t.status === "Pending" &&
        isSameDay(new Date(t.due), today)
    ).length,
    overdue: filteredTasks.filter((t) => {
      if (t.status !== "Pending" || !t.due) return false;
      const taskDate = new Date(t.due);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() < today.getTime();
    }).length,
    completed: filteredTasks.filter((t) => t.status === "Completed").length,
    pending: filteredTasks.filter((t) => t.status === "Pending").length,
    nextDue: filteredTasks
      .filter((t) => t.status === "Pending" && new Date(t.due) >= today)
      .sort((a, b) => new Date(a.due) - new Date(b.due))[0],
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-gray-50 to-blue-100 relative">
      {/* Sidebar */}
      <div className="hidden md:block md:w-64 bg-white p-4 shadow-md">
        <Link href="/">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 text-gray-800">
            TaskPal
          </h2>
        </Link>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="text-blue-600 font-semibold">
            Dashboard
          </Link>
          <Link href="/mytasks" className="text-gray-800 hover:text-blue-600">
            My Tasks
          </Link>
          <Link href="/calendar" className="text-gray-800 hover:text-blue-600">
            Calendar
          </Link>
          <Link href="#" className="text-gray-800 hover:text-blue-600">
            Settings
          </Link>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-4 transform transition-transform
         z-40 md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <Link href={"/"}>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">TaskPal</h2>
        </Link>
        <nav className="flex flex-col space-y-4">
          <Link
            href={"/dashboard"}
            className="text-blue-600 font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href={"/mytasks"}
            className="text-gray-800 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            My Tasks
          </Link>
          <Link
            href={"/calendar"}
            className="text-gray-800 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Calendar
          </Link>
          <Link
            href={"#"}
            className="text-gray-800 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* Content */}
      <main className="w-full p-4 sm:p-6 flex flex-col space-y-6">
        {/* Search */}
        <div className="flex justify-between items-center gap-3 md:gap-6 mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          />
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
            <h3 className="text-2xl font-semibold text-amber-500">
              {statusCounts.todayCount}
            </h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Overdue</p>
            <h3 className="text-2xl font-semibold text-red-500">
              {statusCounts.overdue}
            </h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500">Completed</p>
            <h3 className="text-2xl font-semibold text-green-500">
              {statusCounts.completed}
            </h3>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold text-gray-800">
              Upcoming Task(s)
            </h4>
            <Link href="/addtasks" className="hidden md:block">
              <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md">
                <span className="mr-2 text-lg font-bold">+</span> New Task
              </button>
            </Link>
            <Link href="/addtasks" className="block md:hidden">
              <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <FiPlus size={20} />
              </button>
            </Link>
          </div>

          <ul className="space-y-2">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="p-3 bg-white rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700 font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    {task.due ? task.due.toLocaleDateString() : "No deadline"}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.due && task.due < today
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
            <p className="text-gray-600">Total Tasks: {filteredTasks.length}</p>
            <p className="text-gray-600">Pending: {statusCounts.pending}</p>
            <p className="text-gray-600">Completed: {statusCounts.completed}</p>
            <p className="text-gray-600">Overdue: {statusCounts.overdue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">Next Due Task:</p>
            <p className="font-medium text-blue-700 mt-2">
              {statusCounts.nextDue?.title || "None"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardContents;
