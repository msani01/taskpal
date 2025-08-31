"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase.config";
import ProtectedRoute from "./ProtectedRoute";

const MyTasksContents = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  // subscribe to auth state once
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      console.log("[MyTasks] auth state:", user?.uid);
      setUid(user?.uid || null);
    });
    return () => unsub();
  }, []);

  // realtime tasks for this user
  useEffect(() => {
    if (!uid) {
      setMyTasks([]);
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
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("[MyTasks] fetched", items.length, "tasks");
        setMyTasks(items);
        setLoading(false);
      },
      (err) => {
        console.error("[MyTasks] onSnapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  const toJSDate = (d) => (d?.toDate ? d.toDate() : new Date(d));

  const handleDelete = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    await updateDoc(doc(db, "tasks", task.id), { status: newStatus });
  };

  // compute "Overdue" view-wise (no DB writes needed)
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const normalizedTasks = myTasks.map((t) => {
    const due = toJSDate(t.due);
    const isOverdue = t.status === "Pending" && due < today;
    return { ...t, status: isOverdue ? "Overdue" : t.status, _due: due };
  });

  const filteredTasks =
    filter === "All"
      ? normalizedTasks
      : normalizedTasks.filter((task) => task.status === filter);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <ProtectedRoute>
      {/* fixed sidebar */}
      <div className="hidden md:flex flex-col w-64 fixed top-0 left-0 h-screen bg-gradient-to-b
       from-blue-700 to-blue-900 shadow-xl p-6">
        <Link href="/"><h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">
          TaskPal</h2></Link>
        <nav className="flex flex-col space-y-6 text-lg">
          <Link href="/dashboard" className="text-white hover:text-yellow-300 transition-colors">
          Dashboard</Link>
          <Link href="/mytasks" className="text-white font-semibold hover:text-yellow-300 
          transition-colors">My Tasks</Link>
          <Link href="/calendar" className="text-white hover:text-yellow-300 transition-colors">
          Calendar</Link>
          <Link href="#" className="text-white hover:text-yellow-300 transition-colors">
          Settings</Link>
        </nav>
      </div>

      {/* mobile sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-700 to-blue-900
           shadow-lg p-6 transform transition-transform z-50 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/"><h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">
          TaskPal</h2></Link>
        <nav className="flex flex-col space-y-6 text-lg">
          <Link href="/dashboard" className="text-white font-semibold hover:text-yellow-300
           transition-colors" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
          <Link href="/mytasks" className="text-white hover:text-yellow-300 transition-colors"
           onClick={() => setSidebarOpen(false)}>My Tasks</Link>
          <Link href="/calendar" className="text-white hover:text-yellow-300 transition-colors"
           onClick={() => setSidebarOpen(false)}>Calendar</Link>
          <Link href="#" className="text-white hover:text-yellow-300 transition-colors"
           onClick={() => setSidebarOpen(false)}>Settings</Link>
        </nav>
      </div>

      {/* main content */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <button
            className="md:hidden p-3 bg-blue-700 rounded-lg text-white shadow-md hover:bg-blue-800
             transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <IoMdMenu size={28} />
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-blue-700 p-2 rounded shadow-sm bg-blue-600 text-white"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <Link href="/add-task" className="hidden md:block">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-900
             text-white px-4 py-2 rounded-lg shadow-md ">
              <span className="mr-2 text-xl font-bold">+</span> Add Task
            </button>
          </Link>
          <Link href="/add-task" className="block md:hidden">
            <button className="flex items-center justify-center p-3 rounded-full bg-blue-600
             hover:bg-blue-700 text-white shadow-md">
              <FiPlus size={22} />
            </button>
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-800 mt-6">Loading tasks…</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-gray-800 mt-6">{uid ? "No tasks to show." :
             "Please sign in to view your tasks."}</p>
        ) : (
          <ul className="space-y-4 mt-6">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition flex flex-col
                 md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                  <p className="text-xs mt-1 text-gray-500">
                    Due: {task._due.toLocaleDateString()}
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      task.status === "Completed"
                        ? "text-green-600"
                        : task.status === "Overdue"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {task.status}
                  </p>
                </div>

                <div className="flex gap-2 mt-3 md:mt-0 md:ml-4">
                  <button
                    onClick={() => handleStatusToggle(task)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm
                     shadow-sm"
                  >
                    {task.status === "Completed" ? "Mark Pending" : "Mark Done"}
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm 
                    flex items-center shadow-sm"
                  >
                    <MdDelete />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      </ProtectedRoute>
    </div>
  );
};

export default MyTasksContents;
