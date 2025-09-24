"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase.config";
import ProtectedRoute from "./ProtectedRoute";

const MyTasksContents = () => {
  const [uid, setUid] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Auth subscription ---
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUid(user?.uid || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // --- Firestore realtime tasks ---
  useEffect(() => {
    if (!uid) {
      setMyTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "tasks"), where("userId", "==", uid), orderBy("due", "asc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const t = doc.data();
          return { id: doc.id, ...t, _due: t.due?.toDate ? t.due.toDate() : new Date(t.due) };
        });
        setMyTasks(data);
        setLoading(false);
      },
      (err) => {
        console.error("[MyTasks] onSnapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  // --- Helpers ---
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const handleDelete = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await updateDoc(doc(db, "tasks", task.id), { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredTasks = useMemo(() => {
    const normalizedTasks = myTasks.map((t) => {
      const isOverdue = t.status === "Pending" && t._due < today;
      return { ...t, status: isOverdue ? "Overdue" : t.status };
    });
    if (filter === "All") return normalizedTasks;
    return normalizedTasks.filter((t) => t.status === filter);
  }, [myTasks, filter, today]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 md:ml-64 p-4 sm:p-8 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            <button
              className="md:hidden p-3 bg-blue-700 rounded-lg text-white shadow-md hover:bg-blue-800 transition"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <IoMdMenu size={28} />
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
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

            <Link href="/add-task" className="hidden md:block">
              <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md">
                <span className="mr-2 text-xl font-bold">+</span> Add Task
              </button>
            </Link>
            <Link href="/add-task" className="block md:hidden">
              <button className="flex items-center justify-center p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <FiPlus size={22} />
              </button>
            </Link>
          </div>

          {loading ? (
            <p>Loading tasks…</p>
          ) : filteredTasks.length === 0 ? (
            <p>{uid ? "No tasks to show." : "Please sign in to view your tasks."}</p>
          ) : (
            <ul className="space-y-4 mt-6">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                    <p className="text-xs mt-1 text-gray-500">Due: {task._due.toLocaleDateString()}</p>
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
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm shadow-sm"
                    >
                      {task.status === "Completed" ? "Mark Pending" : "Mark Done"}
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center shadow-sm"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

/* ---------------- Components ---------------- */

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => (
  <>
    {/* Desktop Sidebar */}
    <div className="hidden md:flex flex-col w-64 fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-700 to-blue-900 p-6 shadow-xl">
      <Link href="/">
        <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">TaskPal</h2>
      </Link>
      <nav className="flex flex-col space-y-6 text-lg">
        <Link href="/dashboard" className="text-white hover:text-yellow-300">Dashboard</Link>
        <Link href="/mytasks" className="text-white font-semibold hover:text-yellow-300">My Tasks</Link>
        <Link href="/calendar" className="text-white hover:text-yellow-300">Calendar</Link>
        <Link href="#" className="text-white hover:text-yellow-300">Settings</Link>
      </nav>
    </div>

    {/* Mobile Sidebar */}
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-700 to-blue-900 p-6 shadow-lg transform transition-transform z-50 md:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Link href="/">
        <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">TaskPal</h2>
      </Link>
      <nav className="flex flex-col space-y-6 text-lg">
        <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className="text-white hover:text-yellow-300">Dashboard</Link>
        <Link href="/mytasks" onClick={() => setSidebarOpen(false)} className="text-white font-semibold hover:text-yellow-300">My Tasks</Link>
        <Link href="/calendar" onClick={() => setSidebarOpen(false)} className="text-white hover:text-yellow-300">Calendar</Link>
        <Link href="#" onClick={() => setSidebarOpen(false)} className="text-white hover:text-yellow-300">Settings</Link>
      </nav>
    </div>
  </>
);

export default MyTasksContents;
