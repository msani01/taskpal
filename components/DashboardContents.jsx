"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import { db, auth } from "@/lib/firebase.config";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

const DashboardContents = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  // auth subscription
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      console.log("[Dashboard] auth state:", user?.uid);
      setUid(user?.uid || null);
    });
    return () => unsub();
  }, []);

  // realtime tasks
  useEffect(() => {
    if (!uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", uid),
      orderBy("due", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("[Dashboard] fetched", data.length, "tasks");
        setTasks(data);
        setLoading(false);
      },
      (err) => {
        console.error("[Dashboard] onSnapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  const toJSDate = (d) => (d?.toDate ? d.toDate() : new Date(d));

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks
      .map((t) => ({ ...t, _due: toJSDate(t.due) }))
      .filter((t) => t.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tasks, searchTerm]);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const statusCounts = useMemo(() => {
    const todayCount = filteredTasks.filter(
      (t) => t.status === "Pending" && isSameDay(t._due, today)
    ).length;

    const overdue = filteredTasks.filter((t) => t.status === "Pending" && t._due < today).length;
    const completed = filteredTasks.filter((t) => t.status === "Completed").length;
    const pending = filteredTasks.filter((t) => t.status === "Pending").length;

    const nextDue = filteredTasks
      .filter((t) => t.status === "Pending" && t._due >= today)
      .sort((a, b) => a._due - b._due)[0];

    return { todayCount, overdue, completed, pending, nextDue };
  }, [filteredTasks, today]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* sidebar */}
      <div className="hidden md:flex flex-col w-64 fixed top-0 left-0 h-screen bg-gradient-to-b
       from-blue-700 to-blue-900 shadow-xl p-6">
        <Link href="/"><h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">
          TaskPal</h2></Link>
        <nav className="flex flex-col space-y-6 text-lg">
          <Link href="/dashboard" className="text-white font-semibold hover:text-yellow-300 
          transition-colors">Dashboard</Link>
          <Link href="/mytasks" className="text-white hover:text-yellow-300 transition-colors">
          My Tasks</Link>
          <Link href="/calendar" className="text-white hover:text-yellow-300 transition-colors">
          Calendar</Link>
          <Link href="#" className="text-white hover:text-yellow-300 transition-colors">Settings
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
        <Link href="/"><h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">
          TaskPal</h2></Link>
        <nav className="flex flex-col space-y-6 text-lg">
          <Link href="/dashboard" className="text-white font-semibold hover:text-yellow-300 
          transition-colors" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link href="/mytasks" className="text-white hover:text-yellow-300 transition-colors"
           onClick={() => setMenuOpen(false)}>My Tasks</Link>
          <Link href="/calendar" className="text-white hover:text-yellow-300 transition-colors"
           onClick={() => setMenuOpen(false)}>Calendar</Link>
          <Link href="#" className="text-white hover:text-yellow-300 transition-colors" 
          onClick={() => setMenuOpen(false)}>Settings</Link>
        </nav>
      </div>

      {/* content */}
      <main className="flex-1 md:ml-64 p-6 sm:p-8 space-y-8">
        {/* search and menu toggle */}
        <div className="flex justify-between items-center gap-3 md:gap-6">
          <input
            type="text"
            placeholder={uid ? "Search tasks..." : "Sign in to search tasks"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!uid}
            className="flex-grow px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 disabled:opacity-50"
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
          <Card title="Tasks Due Today" value={statusCounts.todayCount} accent="text-amber-500" />
          <Card title="Overdue" value={statusCounts.overdue} accent="text-red-500" />
          <Card title="Completed" value={statusCounts.completed} accent="text-green-500" />
        </div>

        {/* upcoming */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-2xl font-bold text-gray-800">Upcoming Task(s)</h4>
            <Link href="/add-task" className="hidden md:block">
              <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-base
               px-5 py-3 rounded-lg shadow-md">
                <span className="mr-2 text-xl font-bold">+</span> New Task
              </button>
            </Link>
            <Link href="/add-task" className="block md:hidden">
              <button className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <FiPlus size={22} />
              </button>
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-700">Loading…</p>
          ) : !uid ? (
            <p className="text-gray-700">Please sign in to view your dashboard.</p>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition flex 
                  justify-between items-center"
                >
                  <span className="text-gray-800 font-semibold">{task.title}</span>
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

        {/* summary */}
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
              {statusCounts.nextDue ? `${statusCounts.nextDue.title} — 
              ${statusCounts.nextDue._due.toLocaleDateString()}` : "None"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, value, accent }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
    <p className="text-gray-500">{title}</p>
    <h3 className={`text-4xl font-extrabold ${accent}`}>{value}</h3>
  </div>
);

export default DashboardContents;
