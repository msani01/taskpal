"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import { db, auth } from "@/lib/firebase.config";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import ProtectedRoute from "./ProtectedRoute";

const DashboardContents = () => {
  const [uid, setUid] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);

  // --- Auth listener ---
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUid(user?.uid || null);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // --- Firestore realtime tasks ---
  useEffect(() => {
    if (!uid) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }

    setTasksLoading(true);
    const q = query(collection(db, "tasks"), where("userId", "==", uid), orderBy("due", "asc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const t = doc.data();
          return { id: doc.id, ...t, _due: t.due?.toDate ? t.due.toDate() : new Date(t.due) };
        });
        setTasks(data);
        setTasksLoading(false);
      },
      (err) => {
        console.error(err);
        setTasksLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  const filteredTasks = useMemo(
    () => tasks.filter((t) => t.title?.toLowerCase().includes(searchTerm.toLowerCase())),
    [tasks, searchTerm]
  );

  const { todayCount, overdue, completed, pending, nextDueTasks } = useMemo(() => {
    const todayCount = filteredTasks.filter((t) => t.status === "Pending" && isSameDay(t._due, today)).length;
    const overdue = filteredTasks.filter((t) => t.status === "Pending" && t._due < today).length;
    const completed = filteredTasks.filter((t) => t.status === "Completed").length;
    const pending = filteredTasks.filter((t) => t.status === "Pending").length;
    const nextDueTasks = filteredTasks
      .filter((t) => t.status === "Pending" && t._due >= today)
      .sort((a, b) => a._due - b._due)
      .slice(0, 3);

    return { todayCount, overdue, completed, pending, nextDueTasks };
  }, [filteredTasks, today]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
        <Sidebar />
        <MobileSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main className="flex-1 md:ml-64 p-6 sm:p-8 space-y-8">
          <div className="flex justify-between items-center gap-3 md:gap-6">
            <input
              type="text"
              placeholder={uid ? "Search tasks..." : "Sign in to search tasks"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!uid}
              className="flex-grow px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              className="md:hidden p-3 bg-blue-700 rounded-lg text-white shadow-md hover:bg-blue-800 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <IoMdMenu size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card title="Tasks Due Today" value={todayCount} accent="text-amber-500" />
            <Card title="Overdue" value={overdue} accent="text-red-500" />
            <Card title="Completed" value={completed} accent="text-green-500" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-bold">Upcoming Task(s)</h4>
              <Link href="/add-task" className="hidden md:block">
                <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md">
                  <span className="mr-2 text-xl font-bold">+</span> New Task
                </button>
              </Link>
              <Link href="/add-task" className="block md:hidden">
                <button className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  <FiPlus size={22} />
                </button>
              </Link>
            </div>

            {authLoading ? (
              <p>Checking authentication…</p>
            ) : !uid ? (
              <p>Please sign in to view your dashboard.</p>
            ) : tasksLoading ? (
              <p>Loading tasks…</p>
            ) : filteredTasks.length === 0 ? (
              <p className="italic text-gray-500">No tasks found.</p>
            ) : (
              <ul className="space-y-3">
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg flex justify-between items-center"
                  >
                    <span className="font-semibold">{task.title}</span>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task._due < today
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p>Total Tasks: {filteredTasks.length}</p>
              <p>Pending: {pending}</p>
              <p>Completed: {completed}</p>
              <p>Overdue: {overdue}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p>Next Due Task(s):</p>
              {nextDueTasks.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {nextDueTasks.map((t) => (
                    <li key={t.id} className="font-bold text-blue-700 text-lg">
                      {t.title} — {t._due.toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-bold text-blue-700 mt-2 text-lg">None</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

/* ---------------- Components ---------------- */
const Card = ({ title, value, accent }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
    <p className="text-gray-500">{title}</p>
    <h3 className={`text-4xl font-extrabold ${accent}`}>{value}</h3>
  </div>
);

const Sidebar = () => (
  <div className="hidden md:flex flex-col w-64 fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-700 to-blue-900 p-6 shadow-xl">
    <Link href="/">
      <h2 className="text-3xl font-extrabold text-white mb-8">TaskPal</h2>
    </Link>
    <nav className="flex flex-col space-y-6 text-lg">
      <Link href="/dashboard" className="text-white font-semibold hover:text-yellow-300">Dashboard</Link>
      <Link href="/mytasks" className="text-white hover:text-yellow-300">My Tasks</Link>
      <Link href="/calendar" className="text-white hover:text-yellow-300">Calendar</Link>
      <Link href="#" className="text-white hover:text-yellow-300">Settings</Link>
    </nav>
  </div>
);

const MobileSidebar = ({ menuOpen, setMenuOpen }) => (
  <div
    className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-700 to-blue-900 shadow-lg p-6 transform transition-transform z-50 md:hidden ${
      menuOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <Link href="/">
      <h2 className="text-3xl font-extrabold text-white mb-8">TaskPal</h2>
    </Link>
    <nav className="flex flex-col space-y-6 text-lg">
      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-white font-semibold hover:text-yellow-300">
        Dashboard
      </Link>
      <Link href="/mytasks" onClick={() => setMenuOpen(false)} className="text-white hover:text-yellow-300">
        My Tasks
      </Link>
      <Link href="/calendar" onClick={() => setMenuOpen(false)} className="text-white hover:text-yellow-300">
        Calendar
      </Link>
      <Link href="#" onClick={() => setMenuOpen(false)} className="text-white hover:text-yellow-300">
        Settings
      </Link>
    </nav>
  </div>
);

export default DashboardContents;
