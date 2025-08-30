"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import { db } from "@/lib/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";

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
        t.status === "Pending" && isSameDay(new Date(t.due), today)
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* sidebar */}
      <div className="hidden md:flex flex-col w-64 fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-700 to-blue-900 shadow-xl p-6">
        <Link href="/">
          <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">
            TaskPal
          </h2>
        </Link>
        <nav className="flex flex-col space-y-6 text-lg">
          <Link
            href="/dashboard"
            className="text-white font-semibold hover:text-yellow-300 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/mytasks"
            className="text-white hover:text-yellow-300 transition-colors"
          >
            My Tasks
          </Link>
          <Link
            href="/calendar"
            className="text-white hover:text-yellow-300 transition-colors"
          >
            Calendar
          </Link>
          <Link
            href="#"
            className="text-white hover:text-yellow-300 transition-colors"
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* mobile sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-700 to-blue-900 
          shadow-lg p-6 transform transition-transform z-50 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/">
          <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">
            TaskPal
          </h2>
        </Link>
        <nav className="flex flex-col space-y-6 text-lg">
          <Link
            href="/dashboard"
            className="text-white font-semibold hover:text-yellow-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/mytasks"
            className="text-white hover:text-yellow-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            My Tasks
          </Link>
          <Link
            href="/calendar"
            className="text-white hover:text-yellow-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Calendar
          </Link>
          <Link
            href="#"
            className="text-white hover:text-yellow-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* content */}
      <main className="flex-1 md:ml-64 p-6 sm:p-8 space-y-8">
        {/* search and menu toggle */}
        <div className="flex justify-between items-center gap-3 md:gap-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            className="md:hidden p-3 bg-blue-700 rounded-lg text-white shadow-md hover:bg-blue-800
             transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <IoMdMenu size={28} />
          </button>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <p className="text-gray-500">Tasks Due Today</p>
            <h3 className="text-4xl font-extrabold text-amber-500">
              {statusCounts.todayCount}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <p className="text-gray-500">Overdue</p>
            <h3 className="text-4xl font-extrabold text-red-500">
              {statusCounts.overdue}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <p className="text-gray-500">Completed</p>
            <h3 className="text-4xl font-extrabold text-green-500">
              {statusCounts.completed}
            </h3>
          </div>
        </div>

        {/* upcoming task */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-2xl font-bold text-gray-800">
              Upcoming Task(s)
            </h4>
            <Link href="/add-tasks" className="hidden md:block">
              <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-base
               px-5 py-3 rounded-lg shadow-md">
                <span className="mr-2 text-xl font-bold">+</span> New Task
              </button>
            </Link>
            <Link href="/add-tasks" className="block md:hidden">
              <button className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <FiPlus size={22} />
              </button>
            </Link>
          </div>

          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition flex justify-between
                 items-center"
              >
                <span className="text-gray-800 font-semibold">{task.title}</span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
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

        {/* task summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-600">Total Tasks: {filteredTasks.length}</p>
            <p className="text-gray-600">Pending: {statusCounts.pending}</p>
            <p className="text-gray-600">Completed: {statusCounts.completed}</p>
            <p className="text-gray-600">Overdue: {statusCounts.overdue}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-600">Next Due Task:</p>
            <p className="font-bold text-blue-700 mt-2 text-lg">
              {statusCounts.nextDue?.title || "None"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardContents;
